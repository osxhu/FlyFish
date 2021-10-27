
import { getDemoApi } from '@/services/demo';
import { toMobx } from '@chaoswise/cw-mobx';

const globalStore = {

	namespace: 'globalStore',

	state: {
		num: 0,
		auth: {},
		currentRoute: {}, // 当前路由的配置信息
	},

	effects: {
		*addNumSync() {
			const res = yield getDemoApi();
			if(!res) return;
			this.num = res.data;
			this.addNum();
		}
	},

	reducers: {
		addNum() {
			this.num = this.num + 100;
		},
		updateAuth(auth) {
			this.auth = auth;
		},
		updateCurrentRoute(route) {
			this.currentRoute = route;
		}
	},

	computeds: {
		getDoubleNum() {
			return this.num * 2;
		}
	}

};

export default toMobx(globalStore);