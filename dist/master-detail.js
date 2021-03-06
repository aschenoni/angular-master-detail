(function(){
	'use strict';

	angular
		.module('master.detail', ['ngAnimate'])
		.directive('masterDetail', masterDetail)
		.run(ImportTemplate)

	function masterDetail() {
		return {
			restrict: 'E',
			scope: {
				items: '=',
				setSelected: '=',
				masterDisplay: '=',
				detailDisplay: '=',
				header: '=',
				//Array of functions for each detail to display
				details: '=',
				publicProps: '=',
				add: '&',
				delegateSave: '&save'

			},
			templateUrl: 'app/master-detail/master-detail.directive.html',
			controller: MasterDetailController
		}
	}

	// function MasterDetailController() {
	// 	console.log('MasterDetailController created.')
	// }

	MasterDetailController.$inject = ['$scope', '$timeout']
	function MasterDetailController($scope, $timeout) {
		$scope.currentItem = $scope.initialSelection;
		$scope.currentIndex = 0;
		$scope.keys = keys;
		$scope.updateDetailPane = updateDetailPane;
		$scope.prettify = prettify;
		$scope.addAndSelect = addAndSelect;
		$scope.tracker = tracker;
		$scope.isRefreshingTransition = false;
		$scope.save = save;

		activate();
		///////////
		function activate(){
			$scope.details.forEach(function(detail, index){
				if(typeof detail !== 'function'){
					$scope.details[index] = function(obj){return obj[detail]}
				}
			});

			if(typeof $scope.header != 'function'){
				$scope.header = function(obj){return 'NOT FUNCTION'}
			}
		}
		function updateDetailPane(index){
			$scope.currentIndex = index;
			$scope.isRefreshingTransition = true;
			$timeout(function(){
				$scope.currentItem = $scope.items[index];
				$scope.isRefreshingTransition = false;
			}, 250);
			//this is a callback to the outer scope to perserve selection
			//$scope.setSelected($scope.items[index]);
		}

		function keys(obj){
			return obj ? Object.keys(obj) : []; 
		}

		function prettify(string){
			string = string.replace('_', ' ');
			string = string.replace(/\w\S*/g, 
				function(txt){
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			return string;
		}

		function addAndSelect(){
			$scope.add();
			$scope.updateDetailPane(0);
		}

		function tracker(item, id){
			return item.id || item.temp;
		}

		function save() {
			console.log('saving ' + $scope.currentIndex);
			console.log($scope.delegateSave({index: $scope.currentIndex}))
			// EmployeeService.saveEmployee($scope.currentIndex);
		}
	}

	ImportTemplate.$inject = ['$templateCache'];
	function ImportTemplate($templateCache){
		$templateCache.put('/template/date-picker.directive.html',
			'<div class="master-detail-container">\n<div class="select-list col-xs-4">\n<div class="select-item-toolbar">\n<div style="width:100%; padding-right: 45px;"><input style="width:100%; vertical-align:middle; height: 34px"></div>\n<div style="display:inline; text-align: center">\n<div class="btn glyphicon glyphicon-plus otis-color" ng-click="addAndSelect()" style="display: inline-block; float:none; top: 5; right: 5; position: absolute;"></div>\n</div>\n</div>\n<div class="select-item"\n ng-class="{\'current-item\': $index === currentIndex}"\n ng-repeat="item in items track by tracker(item)"\n ng-click="updateDetailPane($index)">\n<div class="item-header">{{header(item)}}</div>\n<div class="item-detail" ng-repeat="detail in details">{{detail(item)}}</div>\n</div>\n<div class="list-filler"></div>\n</div>\n<div class="detail-pane col-xs-8">\n<div>\n<div ng-hide="!currentItem" style="display: inline-block" ng-class="{\'refresh-animation\': isRefreshingTransition}">\n<h4 class="item-header">{{header(currentItem)}}</h4>\n<div ng-repeat="detailProp in detailDisplay" style="padding-bottom: 5px; vertical-align: middle;">\n<input ng-if="!detailProp.type" \nclass="detail-input" \nng-model="currentItem[detailProp.property]">\n<input ng-if="detailProp.type === \'password\'" \ntype="password" \nclass="detail-input" \nng-model="currentItem[detailProp.property]">\n<select ng-if="detailProp.type === \'dropdown\'" \nclass="detail-input detail-dropdown" \nng-model="currentItem[detailProp.property]"\nng-options="item as prettify(item) for item in detailProp.listItems">\n</select>\n<label class="input-label">{{prettify(detailProp.label || detailProp.property)}}:</label>\n</div>\n<div style="padding-bottom: 20px; float: right">\n<div class="btn btn-success" ng-click="save()">Save</div>\n<div class="btn btn-danger">Delete</div>\n</div>\n</div>\n</div>\n</div>\n<style type="text/css">\nmaster-detail .select-list {\npadding-left: 0px;\npadding-right: 0px;\n}\n\nmaster-detail .list-filler {\nheight: auto;\nflex: auto;\n}\n\nmaster-detail .select-item{\ntransition: .5s linear;\ntransition: 0.01s color linear;\nheight: 6em;\npadding: 0.5em;\nborder-bottom: solid 0.1em;\nborder-color: rgb(200, 200, 200);\ndisplay: block;\nposition: relative;\n}\n\nmaster-detail .select-item-toolbar {\nheight: auto;\npadding: 5px;\nposition: relative;\n}\n\nmaster-detail .detail-pane {\npadding-left: 1.5em;\npadding-top: 1em;\nborder: solid rgb(200, 200, 200) 0.1em;\n}\n\nmaster-detail .master-detail-container {\ndisplay: flex;\nfont-family: helvetica;\nmargin-top: 1em;\n}\n\nmaster-detail .item-header {\nfont-size: 18px;\nfont-weight: bold;\n}\n\nmaster-detail .item-detail {\nfont-style: italic;\n}\n\nmaster-detail label {\npadding-right: 0.1em;\n}\n\nmaster-detail div.detailPane label {\ncolor: green;\n}\n\nmaster-detail .input-label {\npadding-bottom: 0px; \nline-height: 26px; \nfloat:right;\n}\n\nmaster-detail .detail-input {\nfloat:right; \npadding-left: 5px;\n}\n\nmaster-detail .detail-dropdown {\nwidth: 179px;\nheight: 26px;\n}\n\nmaster-detail .select-item.ng-enter, .select-item.ng-leave-active, .select-item.ng-move {\n-webkit-animation: md-enter 600ms cubic-bezier(0.445, 0.050, 0.550, 0.950);\nanimation: enter 600ms cubic-bezier(0.445, 0.050, 0.550, 0.950);\ndisplay: block;\nposition: relative;\n}\n\nmaster-detail .select-item.ng-enter-active, .select-item.ng-leave, .select-item.ng-move-active {\nborder-color: rgb(200, 200, 200);\nopacity: 1;\ntop:0;\nheight: 6em;\n}\n\n\n@-webkit-keyframes md-enter {\nfrom {\nopacity: 0;\nheight: 0px;\nleft: -70px;\n}\n75% {\nleft: 15px;\n}\nto {\nopacity: 1;\nheight: 6em;\nleft: 0px;\n}\n}\n\n@keyframes md-enter {\nfrom {\nopacity: 0;\nheight: 0px;\nleft: -70px;\n}\n75% {\nleft: 15px;\n}\nto {\nopacity: 1;\nheight: 6em;\nleft: 0px;\n}\n}\n\n\n@-webkit-keyframes leave {\nto {\nopacity: 0;\nheight: 0px;\nleft: -70px;\n}\n25% {\nleft: 15px;\n}\nfrom {\nopacity: 1;\nheight: 6em;\nleft: 0px;\n}\n}\n\n@keyframes leave {\nto {\nopacity: 0;\nheight: 0px;\nleft: -70px;\n}\n25% {\nleft: 15px;\n}\nfrom {\nopacity: 1;\nheight: 6em;\nleft: 0px;\n}\n}\n\nmaster-detail .current-item {\ncolor: #373e44;\nbackground-color: #c0c1c1;\n}\n\nmaster-detail .refresh-animation {\nanimation: md-refresh 0.5s;\n}\n\n@keyframes md-refresh {\n0% {\nopacity: 1;\n}\n50% {\nopacity: 0;\n}\n100% {\nopacity: 1;\n}\n}\n</style>\n</div>')
	}
})();