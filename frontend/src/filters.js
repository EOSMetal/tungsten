import Vue from "vue";
import moment from "moment";

Vue.filter("date", ts => moment(parseInt(ts)).format());
Vue.filter("dateFromNow", ts => moment(parseInt(ts)).fromNow());
