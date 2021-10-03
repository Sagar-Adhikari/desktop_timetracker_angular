import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ContractMinView } from 'src/model/contract.model';
import { TimeTrackerModel } from 'src/model/time_tracker.model';
import { ApiService } from '../api/api.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css'],
})
export class ContractDetailComponent implements OnInit {
  public contractView: ContractMinView;
  public loading: boolean = true;
  public sessionInProgress: boolean = false;
  public totalTimeToday: any = ''; //03:50
  public totalMinuteToday: Number;
  public totalHourToday: Number;
  public screenshot_path: string;
  public memoText: string = '';
  public editingMemo: boolean = false;
  private startTime: Date;
  private today: Date;
  private date: string;
  private curSessionIds: any = [];
  public sessionStatus: boolean;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.userService.curContract.subscribe((contract) => {
      this.contractView = contract;
      this.loading = false;
      this.getTotalHoursWorkedDaily(this.contractView.id);
    });
  }

  ngOnInit(): void {
    this.onScreenshotRespHandler();
    this.onDbInsertRespHandler();
  }

  getTotalHoursWorkedDaily(id) {
    this.date = new Date().toISOString().substr(0, 10);

    console.log(this.date);
    var getMinutesUrl =
      environment.baseUrl +
      `/api/timetracker/hours/?contract_id=${id}&date=${this.date}`;
    this.apiService.getRequest(getMinutesUrl).subscribe(
      (resp) => {
        var body = (resp as any).body;
        this.totalTimeToday = Number(body['daily_minutes_worked']);
        this.totalHourToday = Math.floor(Number(this.totalTimeToday) / 60);
        this.totalMinuteToday = Number(this.totalTimeToday) % 60;
        console.log(this.totalHourToday, this.totalMinuteToday);
      },
      (error: HttpErrorResponse) => {
        this.userService.sendMessage(
          'Error fetching total minutes worked.',
          true
        );
        console.log(error);
      }
    );
  }

  onScreenshotRespHandler() {
    (<any>window).api.receive('screenshotResp', (screenId) => {
      (<any>navigator).mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: screenId,
              minWidth: 1280,
              maxWidth: 4000,
              minHeight: 720,
              maxHeight: 4000,
            },
          },
        })
        .then((stream) => {
          this.createScreenshotFromStream(stream);
        });
    });

    (<any>window).api.receive('screenshotError', (data) => {
      console.error(`Received error ${data} from main process`);
    });
  }

  onDbInsertRespHandler() {
    (<any>window).api.receive('dbInsertResp', (inserted) => {
      var createUrl = environment.baseUrl + '/api/timetracker/create/';
      this.apiService.postRequest(createUrl, inserted).subscribe(
        (resp) => {
          console.log('uploaded to server...');
          // now remove from local db

          this.curSessionIds.push(inserted._id);

          (<any>window).api.send('db_remove', inserted._id);
        },
        (err: HttpErrorResponse) => {
          console.log('err uploading to  server');
          console.error(err);
        }
      );
    });

    (<any>window).api.receive('dbInsertRespError', (data) => {
      console.error(`Received error ${data} from main process during insert!`);
    });
  }

  getProgressTime(): string {
    var hrString =
      this.hours < 10 ? '0' + this.hours.toString() : this.hours.toString();
    var minString =
      this.minutes < 10
        ? '0' + this.minutes.toString()
        : this.minutes.toString();
    return hrString + ':' + minString;
  }

  intervalId: any;
  minutes: number = 0;
  hours: number = 0;

  startSession() {
    if (this.memoText == '' || this.memoText == null) {
      this.userService.sendMessage(
        'Please add a Memo for this task first!',
        true
      );
      return;
    }
    this.startTime = new Date();
    this.sessionInProgress = true;
    var value = this.sessionInProgress;
    (<any>window).api.send('onClose', value);

    this.userService.sendMessage('Starting new session...', false);
    this.takeScreenShot();

    this.intervalId = setInterval(() => {
      this.incrementTime();
      var now = new Date();
      var min = now.getMinutes();

      if (min % 10 == 0) {
        this.takeScreenShot();
      }
    }, 60 * 1000); //every 1 minute
  }

  incrementTime() {
    if (this.minutes == 59) {
      this.hours++;
      this.minutes = 0;
    } else {
      this.minutes++;
    }
  }

  takeScreenShot() {
    (<any>window).api.send('startScreenshot');
  }

  stopSession() {
    var updateUrl = environment.baseUrl + '/api/timetracker/update_end_times/';
    var updateBody = {
      end_time: new Date(),
      screenshot_ids: this.curSessionIds,
    };

    this.apiService.putRequest(updateUrl, updateBody).subscribe(
      (resp) => {
        this.curSessionIds = [];
        clearInterval(this.intervalId);
        this.sessionInProgress = false;
        var value = this.sessionInProgress;
        (<any>window).api.send('onClose', value);
      },
      (err: HttpErrorResponse) => {
        console.log('err uploading to  server');
        console.error(err);
      }
    );
  }

  editBtnClicked() {
    this.editingMemo = !this.editingMemo;
  }

  createScreenshotFromStream(stream) {
    var imageFormat = 'image/jpeg';
    var that = this;
    // Create hidden video tag
    var video = document.createElement('video');
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
    // Event connected to stream
    video.onloadedmetadata = function () {
      video.play();
      // Create canvas
      var canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      var ctx = canvas.getContext('2d');
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      var base64Image = canvas.toDataURL(imageFormat);
      that.screenshot_path = base64Image;

      that.persistScreenshotData();

      // Remove hidden video tag
      video.remove();

      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {}
    };
    video.srcObject = stream;
    document.body.appendChild(video);
  }

  persistScreenshotData() {
    var ttm = new TimeTrackerModel(
      this.contractView.id,
      this.memoText,
      new Date(),
      this.startTime,
      null,
      this.screenshot_path,
    );
    (<any>window).api.send('db_insert', ttm);
  }

  backClicked() {
    if (this.sessionInProgress) {
      this.userService.sendMessage(
        'Please stop the running timer before going back.',
        true
      );
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
