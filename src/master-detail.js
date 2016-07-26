(function(){
	'use strict';

	angular
		.module('master.detail', ['ngAnimate'])
		.directive('masterDetail', masterDetail);

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
})();