import Vue from "vue";
import moment from "moment";

Vue.filter("date", ts => moment(parseInt(ts) * 1000).format());
Vue.filter("dateFromNow", ts => moment(parseInt(ts) * 1000).fromNow());
