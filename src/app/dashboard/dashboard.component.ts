import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { UserModel } from 'src/model/user.model';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ContractMinView } from 'src/model/contract.model';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user: UserModel;
  contracts: any = [];
  searchContractsText: string = '';

  screenShotResp: any = [];
  loading: boolean = false;

  dataLength = 0;
  perpage = 10;
  pageEvent: PageEvent;
  pageIndex = 1;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.userService.user.subscribe((userModel) => {
      this.user = userModel;
      if (this.user != null) {
        this.getContracts();

        (<any>window).api.send('db_get');
        this.onDbGetRespHandler();
      }
    });
  }

  getContracts() {
    this.loading = true;
    var contractsUrl =
      environment.baseUrl +
      `/api/contract/milestone/?freelancer=${this.user.user_id}&offer_status=Accept&page=${this.pageIndex}`;
    this.apiService.getRequest(contractsUrl).subscribe(
      (resp) => {
        var body = (resp as any).body;
        this.dataLength = body.count;
        this.loading = false;
        if (body.count > 0) {
          this.contracts = body.results;
        }
      },
      (error: HttpErrorResponse) => {
        this.userService.sendMessage(
          'Error fetching contracts from server.',
          true
        );
        console.log(error);
      }
    );
  }

  onDbGetRespHandler() {
    (<any>window).api.receive('dbGetResp', (resp) => {
      var docs = resp as [];
      if (docs.length > 0) {
        docs.forEach((doc: any) => {
          this.savePendingScreenshots(doc);
        });
      }
    });
  }

  ngOnInit(): void {}

  savePendingScreenshots(doc: any) {
    var createUrl = environment.baseUrl + '/api/timetracker/create/';
    this.apiService.postRequest(createUrl, doc).subscribe(
      (resp) => {
        //delete uploaded doc
        (<any>window).api.send('db_remove', doc._id);
      },
      (err: HttpErrorResponse) => {
        console.log('err uploading to  server');
        console.error(err);
      }
    );
  }

  contractClick(contract: any) {
    var model = new ContractMinView(
      contract.id,
      contract.title,
      contract.client.first_name
    );
    this.userService.setCurContract(model);
    this.router.navigate(['/contract-detail']);
  }

  handlePage(e: any) {
    this.pageIndex = e.pageIndex;
  }
}
