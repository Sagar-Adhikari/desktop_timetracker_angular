export class TimeTrackerModel {
    constructor(
        public contract_id: string,
        public memo: string,
        public screen_shot_time: Date,
        public start_time: Date,
        public end_time: Date,
        public base64_ss: string
    ) { }
}