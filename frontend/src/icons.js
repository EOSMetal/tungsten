import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faLink,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faHome, faLink, faQuestionCircle, faGithub);
Vue.component("fa-icon", FontAwesomeIcon);
