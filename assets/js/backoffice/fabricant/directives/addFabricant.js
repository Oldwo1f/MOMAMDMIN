angular.module('momi-pai')
.directive('addFabricant', function(){

    'use strict';

    return {
      	scope: {
      		newFabricant:'=',
      	},
      	replace: true,
      	templateUrl: 'js/backoffice/fabricant/partials/addFabricant.html',
      	controller:function($state,$timeout,$scope,userService,$rootScope,fabricantService,$mdToast,imageService,documentService, tagService, categoryService, $q, Upload,$sailsSocket){

      		$scope.touched = false;
      		console.log($state);
      		console.log($state.current.name);
      		if($state.current.name == 'fabricants.edit'){
      			$scope.touched = true;
      		}
      		$rootScope.$on('$stateChangeStart',function (e,toState,toParams,fromState,fromParams){


      			console.log('STATE CHANGE START');
      			console.log($scope.touched);
      			console.log($scope.formData.id);
      			if($scope.touched == false){
	      			fabricantService.remove($scope.formData.id).then(function(data){
						console.log('----------------------------------------------------------');
						$rootScope.$broadcast('fabricantSelfRemove',data.id);
						
	            		// $state.go('^')

	        			$rootScope.stopSpin();
					},function(d){
						console.log('EROOR'); 
					})
      			}
		          

		   });

		  	window.onbeforeunload = function (e) {
				console.log('HEYHEYHEY HOOOOOOOOOOOOOOOOOO');
				console.log($scope.formData.title);
				console.log(e);

			  if(1 == 2){
				  	var e = e || window.event;

				  // For IE and Firefox
				  if (e) {
				    e.returnValue = 'Any string1';
				  }

			  // For Safari
			  	return 'Any string';
			  }
			  else{
			  	if($scope.touched == false){
	      			fabricantService.removeSyncro($scope.formData.id).then(function(data){
						console.log('----------------------------------------------------------');
						$rootScope.$broadcast('fabricantSelfRemove',data.id);
						
	            		// $state.go('^')

	        			$rootScope.stopSpin();
					},function(d){
						console.log('EROOR'); 
					})
      			}
      			
			  	// return null;
			  }
			};
      		$scope.returnParentState=function(){
				$state.go('^')
			}
			$scope.returnPreviousState=function(){
				if($rootScope.previousState){
					$state.go($rootScope.previousState.name, $rootScope.previousStateParams)
				}else{
					$state.go('^')
				}
			}
			$scope.returnDashboardState=function(){
				$state.go('dashboard')
			}
      		
			$scope.selectedItem = null;
    		$scope.searchText = null;
    		
      		$scope.NewImage='';

      		console.log($scope.newFabricant);
			$scope.formData=$scope.newFabricant;
			if($state.current.name != 'fabricants.edit'){
      			// $scope.touched = true;
				$rootScope.$broadcast('fabricantSelfAdd',$scope.newFabricant);
      		}

			$sailsSocket.subscribe('fabricant',function(data){
			        console.log('ON ARTICLE2');
			        console.log(data);
			        if(data.id == $scope.newFabricant.id)
			        {
			        	console.log('cool');
			        	if(data.verb =='created'){
			        	// _.find($scope.fabricantsList,function(o) { return o.age < 40; });
			        	// var index = _.findIndex($scope.fabricantsList, function(o) { return o.id == data.id; });
						// if( index !== -1) {
							console.log('created');
							// console.log($scope.fabricantsList[index]);
							// _.merge($scope.formData, data.data)

						}else
						if(data.verb =='updated'){
			        	// _.find($scope.fabricantsList,function(o) { return o.age < 40; });
			        	// var index = _.findIndex($scope.fabricantsList, function(o) { return o.id == data.id; });
						// if( index !== -1) {
							console.log('MERGE');
							// console.log($scope.fabricantsList[index]);
							_.merge($scope.formData, data.data)

						}else
						if(data.verb =='destroyed'){
			        	$state.go('^')

						}else
						if(data.verb =='addedTo'){
							console.log('addedTO');
							if(data.attribute == 'tags'){

								console.log('TAGS');
								console.log(data.addedId);
								tagService.fetchOne(data.addedId).then(function(tag){
									console.log(tag);
									$scope.formData.tags.push(tag)

								},function(d){
									console.log('EROOR');
								})
							}else
							if(data.attribute == 'categories'){

								console.log('categories');
								console.log(data.addedId);
								categoryService.fetchOne(data.addedId).then(function(cat){
									console.log(cat);
									$scope.formData.categories.push(cat)

								},function(d){
									console.log('EROOR');
								})
							}
							if(data.attribute == 'images'){

								console.log('images');
								console.log(data.addedId);
								imageService.fetchOne(data.addedId).then(function(cat){
									console.log(cat);
									$scope.formData.images.push(cat)

								},function(d){
									console.log('EROOR');
								})
							}
							if(data.attribute == 'documents'){

								console.log('documents');
								console.log(data.addedId);
								documentService.fetchOne(data.addedId).then(function(cat){
									console.log(cat);
									$scope.formData.documents.push(cat)

								},function(d){
									console.log('EROOR');
								})
							}
							if(data.attribute == 'authors'){

								console.log('authors');
								console.log(data.addedId);
								userService.fetchOne(data.addedId).then(function(user){
									console.log(user);
									$scope.formData.authors.push(user)

								},function(d){
									console.log('EROOR');
								})
							}

						}else
						if(data.verb =='removedFrom'){
							console.log('removeFrom');
							if(data.attribute == 'tags'){
								var index = _.findIndex($scope.formData.tags, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									$scope.formData.tags.splice(index,1)
								}
							}
							if(data.attribute == 'categories'){
								var index = _.findIndex($scope.formData.categories, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									$scope.formData.categories.splice(index,1)
								}
							}
							if(data.attribute == 'images'){
								var index = _.findIndex($scope.formData.images, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									$scope.formData.images.splice(index,1)
								}
							}
							if(data.attribute == 'documents'){
								var index = _.findIndex($scope.formData.documents, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									$scope.formData.documents.splice(index,1)
								}
							}
							if(data.attribute == 'authors'){
								var index = _.findIndex($scope.formData.authors, function(o) { return o.id == data.removedId; });
								if( index !== -1) {
									$scope.formData.authors.splice(index,1)
								}
							}
							// if(data.attribute == 'comments'){
							// 	var index = _.findIndex($scope.formData.comments, function(o) { return o.id == data.removedId; });
							// 	if( index !== -1) {
							// 		$scope.formData.comments.splice(index,1)
							// 	}
							// }

						}
			        }else{
			        	console.log('PAS bon ID');
			        }
			   //      if(data.verb =='created'){

			   //      	$scope.fabricantsList.unshift(data.data)
			        	
			   //      }else
			   //      if(data.verb =='updated'){
			   //      	// _.find($scope.fabricantsList,function(o) { return o.age < 40; });
			   //      	var index = _.findIndex($scope.fabricantsList, function(o) { return o.id == data.id; });
						// if( index !== -1) {
							
						// 	console.log($scope.fabricantsList[index]);
						// 	_.merge($scope.fabricantsList[index], data.data)

						// }
			   //      }
			    })
			$sailsSocket.subscribe('category',function(data){
			        console.log('ON category');
			        console.log(data);
			        
			        if(data.verb =='updated'){

			        	console.log('updated');
			        	console.log(data.id);
			        	// console.log($scope.fabricantsList);

			        	
	        			var index = _.findIndex($scope.formData.categories, function(o) { return o.id == data.id; });
						if( index !== -1) {
							console.log(data.data);
							// $scope.fabricantsList[i].categories.splice(index,1,data.data)
							_.merge($scope.formData.categories[index], data.data)
						}
			        	
			        	// _.find($scope.fabricantsList,function(o) { return o.age < 40; });
			   //      	var index = _.findIndex($scope.fabricantsList, function(o) { return o.id == data.id; });
						// if( index !== -1) {
							
						// 	console.log($scope.fabricantsList[index]);
						// 	_.merge($scope.fabricantsList[index], data.data)
						// 	console.log(data.id);
						// 	// $scope.$broadcast('ellipsContent-'+data.id);
						// }
			        }
			       
			})
			$sailsSocket.subscribe('comment',function(data){
			        console.log('ON comment');
			        console.log(data);
			        
			        if(data.verb =='addedTo' && data.attribute=="responses"){

			        	console.log('updated');
			        	console.log(data.id);
			        	// console.log($scope.fabricantsList);
	        			var index = _.findIndex($scope.formData.comments, function(o) { return o.id == data.id; });
						if( index !== -1) {
							fabricantService.fetchOneComment(data.addedId).then(function(data){
								console.log(data);
								$scope.formData.comments[index].responses.push(data)
								
							})
							// console.log(data.data);
						}
			        }
			        if(data.verb =='updated'){

			        	console.log('updated');
			        	console.log(data.id);
			        	// console.log($scope.fabricantsList);
	        			var index = _.findIndex($scope.formData.comments, function(o) { return o.id == data.id; });
						if( index !== -1) {
							console.log(data.data);
							// $scope.fabricantsList[i].categories.splice(index,1,data.data)
							_.merge($scope.formData.comments[index], data.data)
						}else{
							var returnedCom ; 
							_.map($scope.formData.comments,function(com){
								var index2 = _.findIndex(com.responses, function(o) { return o.id == data.id; });
								if( index2 !== -1){
									console.log(data);
									_.merge(com.responses[index2], data.data)
									returnedCom = com;
									return true
									
								}else{
									return false
								}

							})
							console.log(returnedCom);

							var index3 = _.findIndex($scope.formData.comments, function(o) { return o.id == returnedCom.id; });
							$scope.formData.comments[index3] = returnedCom
						}
			        }
			        if(data.verb =='destroyed'){

			        	console.log('destroyed');

			        	console.log(data.id);
			        	// console.log($scope.fabricantsList);
	        			var index = _.findIndex($scope.formData.comments, function(o) { return o.id == data.id; });
						if( index !== -1) {
							console.log(data.data);
							// $scope.fabricantsList[i].categories.splice(index,1,data.data)
							$scope.formData.comments.splice(index, 1)
						}else{
							var returnedCom ; 
							_.map($scope.formData.comments,function(com){
								var index2 = _.findIndex(com.responses, function(o) { return o.id == data.id; });
								if( index2 !== -1){
									console.log(data);
									com.responses.splice(index2, 1)
									returnedCom = com;
									return true
									
								}else{
									return false
								}

							})
							console.log(returnedCom);

							var index3 = _.findIndex($scope.formData.comments, function(o) { return o.id == returnedCom.id; });
							$scope.formData.comments[index3] = returnedCom
						}
			        }
			       
			})

			$scope.closeDatePicker=function(t,tt){
				$('.open').removeClass('open')
			}
			$scope.update=function(attribute){

				$rootScope.startSpin();
				var attrToUpdate = {};
				attrToUpdate[attribute] = $scope.formData[attribute];
				fabricantService.update($scope.formData.id,attrToUpdate).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					console.log($scope.$parent);
					$scope.touched = true;
					$rootScope.$broadcast('fabricantSelfChange',data);

        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}


			$scope.validateFabricant=function(){
				$rootScope.startSpin();
				
				fabricantService.validatePai($scope.formData.id).then(function(data){
					console.log(data);
					if(data.data[0].solded){
						$scope.formData.solded = true; 
					}
					if(data.data[0].validate){
						$scope.formData.validate = data.data[0].validate; 
					}
					if(data.data[0].status){
						$scope.formData.status = data.data[0].status; 
					}
        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}

			$scope.unvalidateFabricant=function(raison){

				if(raison == 'counterOffer' && !$scope.formData.counterOffer)
					return;

				$rootScope.startSpin();

				fabricantService.unvalidatePai($scope.formData.id,raison,$scope.formData.counterOffer).then(function(data){
					console.log(data);
					if(data.data[0].solded){
						$scope.formData.solded = true; 
					}
					if(data.data[0].validate){
						$scope.formData.validate = data.data[0].validate; 
					}
					if(data.data[0].status){
						$scope.formData.status = data.data[0].status; 
					}
        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}
			

			$scope.updateComment=function(id,attribute,value){
				console.log(id);
				$rootScope.startSpin();
				var attrToUpdate = {};
				attrToUpdate[attribute] = value;
				fabricantService.updateComment(id,attrToUpdate).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					// console.log($scope.$parent);
					// $rootScope.$broadcast('userSelfChange',data);

        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}
			$scope.AddReponse=function(id,tmpRep){

				console.log(id);
				$rootScope.startSpin();
				var attrToUpdate = {};
				attrToUpdate.content = tmpRep;
				console.log(tmpRep);
				attrToUpdate.authorName = userService.me.firstname+ ' ' + userService.me.name;
				attrToUpdate.email = userService.me.email;
				attrToUpdate.admin = true;
				attrToUpdate.status = 'actif';
				// console.log(userService.me.images[0].filename);
				if(userService.me.images.length){
					attrToUpdate.imgpath = userService.me.images[0].filename;
				}
				fabricantService.addReponse(id,attrToUpdate).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);

					var index = _.findIndex($scope.formData.comments, function(o) { return o.id == data.parent.id; });
					if( index !== -1) {
						// var index2 = _.findIndex($scope.formData.comments[index], function(o) { return o.id == data.parent.id; });
							$scope.formData.comments[index].responses.push(data.child)
							$scope.formData.comments[index].tmpRep = '';

					}
					// console.log($scope.$parent);
					// $rootScope.$broadcast('userSelfChange',data);

        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}
			$scope.deleteComment=function(id){
				console.log(id);
				$rootScope.startSpin();
				var attrToUpdate = {};
				fabricantService.deleteComment(id).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					var index = _.findIndex($scope.formData.comments, function(o) { return o.id == id; });
					if( index !== -1) {
						$scope.formData.comments.splice(index, 1);
					}else{
							var returnedCom ; 
							_.map($scope.formData.comments,function(com){
								var index2 = _.findIndex(com.responses, function(o) { return o.id == data.id; });
								if( index2 !== -1){
									console.log(data);
									com.responses.splice(index2, 1)
									returnedCom = com;
									return true
									
								}else{
									return false
								}

							})
							console.log(returnedCom);

							var index3 = _.findIndex($scope.formData.comments, function(o) { return o.id == returnedCom.id; });
							$scope.formData.comments[index3] = returnedCom
					}
					// $rootScope.$broadcast('fabricantSelfChangeDoc',data);
					//  else {
					// 	$scope.formData.tags.push(tag_with_id);
					// }

        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}	
			$scope.removeThis=function(id){
				$rootScope.startSpin();
				// var attrToUpdate = {};
				// attrToUpdate[attribute] = $scope.formData[attribute];
				fabricantService.remove($scope.formData.id).then(function(data){
					console.log('----------------------------------------------------------');
					console.log(data);
					console.log(id);
					$rootScope.$broadcast('fabricantSelfRemove',id);
					
            		$state.go('^')

				// 	console.log(data);
				// 	console.log($scope.$parent);
				// 	$rootScope.$broadcast('fabricantSelfChange',data);

        			$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}

		    $scope.autocompleteTag =function(query) {
		    	console.log('autocompleteTag');
		    	return tagService.searchTags(query)
		    }
		    $scope.autocompleteCategories =function(query) {
		    	return categoryService.searchCategories(query)
		    }
		    $scope.autocompleteAuthors =function(query) {
		    	return userService.searchUsers(query)
		    }
		   

		    $scope.unselectOnBlur=function(){
		    	console.log('onBlur');
		    	$('.tag-item.selected').removeClass('selected')
		    }
			$scope.addTag=function(newTag){
				console.log(newTag);
				$rootScope.startSpin();
				var tagText = newTag.text;
				fabricantService.addTag($scope.formData.id,newTag).then(function(data){
					$rootScope.$broadcast('fabricantSelfChangeTag',data.parent);
					var tag_with_id =data.child
					var index = _.findIndex($scope.formData.tags, function(o) { return o.text == tagText; });
					if( index !== -1) {
						$scope.formData.tags.splice(index, 1, tag_with_id);
					} else {
						$scope.formData.tags.push(tag_with_id);
					}
					$scope.touched = true;

				$rootScope.stopSpin();
				},function(d){
					console.log(d);
					console.log('EROOR');
				})
			}	
			function transformTag(newTag){
				if (newTag.id){
					return newTag
				}else{
					return {
				    	text: newTag,
					};
				}
			}	

			$scope.removeTag=function(t){
				$rootScope.startSpin();
				fabricantService.removeTag($scope.formData.id,t).then(function(data){
					console.log(data);
					$rootScope.$broadcast('fabricantSelfChangeTag',data);
					$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}
			$scope.addCategory=function(newCategory){
				var name = newCategory.name;
				$rootScope.startSpin();
				if(!newCategory.id)
				{
					newCategory={};
					newCategory.name = name;
					newCategory.color = 'darkgrey';
					newCategory.textColor = 'white';
				}
				console.log(newCategory);
				fabricantService.addCategory($scope.formData.id,newCategory).then(function(data){
					$rootScope.$broadcast('fabricantSelfChangeCat',data.parent);

					console.log(data);
					var tag_with_id =data.child;
					var index = _.findIndex($scope.formData.categories, function(o) { return o.name == name || o.text == name; });
					
					console.log('index='+index);
					if( index != -1) {
						console.log('index different -1');
						$scope.formData.categories.splice(index, 1, tag_with_id);
					} else {
						console.log('---------------------------------------------------------');
						console.log(tag_with_id);
						$scope.formData.categories.push(tag_with_id);


					}
					$scope.touched = true;

					$rootScope.stopSpin();
						
				},function(d){
					console.log(d);
					console.log('EROOR');
				})
			}	
			function transformCategory(newCategory){

				console.log('transformCategory');
				if (newCategory.id){
					return newCategory
				}else{
					return {
				    	name: newCategory,
				    	color : 'darkgrey',
						textColor : 'white'
					};
				}
			}	

			$scope.removeCategory=function(category){
				$rootScope.startSpin();
				fabricantService.removeCategory($scope.formData.id,category).then(function(data){
					$rootScope.$broadcast('fabricantSelfChangeCat',data);
					$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}	

			$scope.addAuthor=function(newAuthor){
				var name = newAuthor.name;
				$rootScope.startSpin();
				if(!newAuthor.id)
				{
					newAuthor={};
					newAuthor.name = name;
					newAuthor.color = 'darkgrey';
					newAuthor.textColor = 'white';
				}
				// console.log(newAuthor);
				fabricantService.addAuthor($scope.formData.id,newAuthor).then(function(data){
					$rootScope.$broadcast('fabricantSelfChangeAuthorAdd',data);
					// data = data.data;
					// console.log('ttttttttttttttttttttttttttttttttttttttttt');
					// console.log(data);
					// var tag_with_id =data.child;
					// var index = _.findIndex($scope.formData.authors, function(o) { return o.name == name || o.text == name; });
					
					// // console.log('index='+index);
					// if( index != -1) {
					// 	// console.log('index different -1');
					// 	$scope.formData.authors.splice(index, 1, tag_with_id);
					// } else {
					// 	// console.log('---------------------------------------------------------');
					// 	// console.log(tag_with_id);
					// 	$scope.formData.authors.push(tag_with_id);


					// }
					$scope.touched = true;

					$rootScope.stopSpin();
						
				},function(d){
					console.log('EROOR');
				})
			}	
			function transformAuthor(newAuthor){

				console.log('transformAuthor');
				if (newAuthor.id){
					return newAuthor
				}else{
					return {
				    	name: newAuthor,
					};
				}
			}	

			$scope.removeAuthor=function(author){
				$rootScope.startSpin();
				fabricantService.removeAuthor($scope.formData.id,author).then(function(data){
					$rootScope.$broadcast('fabricantSelfChangeAuthorRemove',data);
					$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}	

			$scope.changeVideoHost = function(host){
				console.log('changeVideoHost  '+ host);
				$scope.formData.videoHost = host;
			}
			function tinymce_focus(){
				console.log('FOCUS');
		        $('.mce-edit-area').addClass('focused');
		    }

		    function tinymce_blur(){
		        $('.mce-edit-area').removeClass('focused');
		    	console.log('BLUR');
		    }

      		$scope.tinymceOption ={
      			// skin: 'myStyle',
      			content_css : '/styles/backoffice/tinymce.css' ,
      			setup: function(editor) {

  					var placeholder = $('#' + editor.id).attr('placeholder');
				    if (typeof placeholder !== 'undefined' && placeholder !== false) {
				      var is_default = false;
				      editor.on('init', function() {
				        // get the current content
				        var cont = editor.getContent();
				        $(editor.getDoc()).contents().find('body').focus(function(){tinymce_focus();});
                    	$(editor.getDoc()).contents().find('body').blur(function(){tinymce_blur();});
				        // If its empty and we have a placeholder set the value
				        if (cont.length === 0) {
				          editor.setContent(placeholder);
				          // Get updated content
				          cont = placeholder;
				        }
				        // convert to plain text and compare strings
				        is_default = (cont == placeholder);

				        // nothing to do
				        if (!is_default) {
				          return;
				        }
				      })
				      .on('focus', function() {
				        // replace the default content on focus if the same as original placeholder
				        if (is_default) {
				          editor.setContent('');
				        }
				      })
			      	  .on("blur", function() {
					        console.log('ON bbbblur');
				         	if (editor.getContent().length === 0) {
						    	editor.setContent(placeholder);
					    	}else{
					    		is_default = false;
					    	}
				      	});
		      		}

		      		editor.on("blur", function() {
				        
				        $scope.update('content');
			      	});
				},
      			plugins: 'link image code',
      			statusbar:false,
      			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image '

      			

			}

			$scope.tinymceModel = 'Initial content';
      		


        	$scope.indexDocument=0;
        	$scope.uploadsDocument=[];

        	$scope.uploadDocument = function (files) {
		        if (files && files.length) {
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                $scope.uploadsDocument[$scope.indexDocument]={};
		                $scope.uploadsDocument[$scope.indexDocument].file=file;
		                $scope.uploadsDocument[$scope.indexDocument].status='start';
		                $scope.uploadsDocument[$scope.indexDocument].text='0%';
		                $scope.indexDocument++;
		            }
		            for (var i = 0; i < $scope.uploadsDocument.length; i++) {
		                if( $scope.uploadsDocument[i].status=='start'){
		                	
		                    $scope.uploadsDocument[i].status='progress';
		                    (function(i){
			                    Upload.upload({
			                        url: '/api/fabricant/'+$scope.formData.id+'/documents',
			                        data: {files : $scope.uploadsDocument[i].file,filename:'tt',name:'t'}
			                    }).then(function (data) {
			                        // $scope.formData.documents = data.data.parent.documents
			                        console.log(data);
			                        // $rootScope.$broadcast('fabricantSelfChange',data.data.parent);
			                        $rootScope.$broadcast('fabricantSelfChangeDoc',data.data.parent);
			                        // $rootScope.$broadcast('fabricantSelfChange',data.parent);
			                        $scope.uploadsDocument[i].text='Envoi terminé';
									$scope.touched = true;

			                        (function(i){

	                                    $timeout(function () {
	                                        $scope.uploadsDocument[i].status = 'success';
	                                    },3000)
	                                })(i)
			                    },function (evt) {
			                        //HANDLE ERROR
			                    },function (evt) {
	                                $scope.uploadsDocument[i].progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                                $scope.uploadsDocument[i].text = $scope.uploadsDocument[i].progressPercentage+'%'
			                    });
		                    })(i)
		                }
		            };
		        }
		    };

			$scope.removeDocument=function(doc){
				$rootScope.startSpin();
				fabricantService.removeDocument($scope.formData.id,doc).then(function(data){
					var index = _.findIndex($scope.formData.documents, function(o) { return o.id == doc; });
					if( index !== -1) {
						$scope.formData.documents.splice(index, 1);
					}
					$rootScope.$broadcast('fabricantSelfChangeDoc',data);
					//  else {
					// 	$scope.formData.tags.push(tag_with_id);
					// }
					$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}
			$scope.removeImg=function(img){
				$rootScope.startSpin();
				fabricantService.removeImage($scope.formData.id,img).then(function(data){
					var index = _.findIndex($scope.formData.images, function(o) { return o.id == img; });
					if( index !== -1) {
						$scope.formData.images.splice(index, 1);
					}
					//  else {
					// 	$scope.formData.tags.push(tag_with_id);
					// }
					$rootScope.$broadcast('fabricantSelfChangeImg',data);
					$rootScope.stopSpin();
				},function(d){
					console.log('EROOR');
				})
			}

        	$scope.indexImage=0;
        	$scope.uploadingImages=[];

        	$scope.resizeOnly=function(){
        		$rootScope.startSpin();
				$scope.dataToSend = {};
		        $scope.dataToSend.displayHeight = $scope.imgcrop.displayHeight;
		        $scope.dataToSend.displayWidth = $scope.imgcrop.displayWidth;
		        $scope.dataToSend.scaledWidth = $scope.imgcrop.scaledWidth;
		        $scope.dataToSend.scaledHeight = $scope.imgcrop.scaledHeight;
		        $scope.dataToSend.scaledTop = $scope.imgcrop.scaledTop;
		        $scope.dataToSend.scaledLeft = $scope.imgcrop.scaledLeft;
		        $scope.dataToSend.aspectRatio = $scope.imgcrop.aspectRatio;
		        $scope.dataToSend.landscape = $scope.imgcrop.landscape;
		        $scope.dataToSend.containerWidth = $scope.imgcrop.containerWidth;
		        $scope.dataToSend.containerHeight = $scope.imgcrop.containerHeight;
		        $scope.dataToSend.filename= $scope.imgcrop.filename;
		        $scope.dataToSend.normalWidth= 800;
            	$scope.dataToSend.normalHeight= 450;
            	if(!$scope.imgcrop.landscape){
            		$scope.dataToSend.normalWidth= 300;
            		$scope.dataToSend.normalHeight= 400;
            	}
				$('#imageCropSource').hide();

		        $scope.imgcrop.imgEditId = 0;
            	$scope.imgcrop.displayHeight = 0;
				$scope.imgcrop.displayWidth = 0;
				$scope.imgcrop.scaledWidth = 0;
				$scope.imgcrop.scaledHeight = 0;
				$scope.imgcrop.scaledTop = 0;
				$scope.imgcrop.scaledLeft = 0;
				$scope.imgcrop.containerWidth = 0;
				$scope.imgcrop.containerHeight = 0;
				$scope.imgcrop.aspectRatio = '16/9';
				$scope.imgcrop.imgSrc = "";

		        $sailsSocket.post('/api/image/resize/',$scope.dataToSend).success(function (data,status) {
		            console.log('SUCCESS RESIZE');
		            $rootScope.stopSpin();
		            
		        }).error(function (data,status) {
		            console.log(data);
		            console.log('errOR');
		        })
	        }

        	$scope.uploadImage = function () {

        		console.log($scope.imgcrop);
        		console.log('UPLOAD IMAGE');
		        $scope.dataToSend = {};
		        $scope.fileToSend = $scope.imgcrop.file; 
		        $scope.dataToSend.file = $scope.imgcrop.file; 
		        $scope.dataToSend.displayHeight = $scope.imgcrop.displayHeight;
		        $scope.dataToSend.displayWidth = $scope.imgcrop.displayWidth;
		        $scope.dataToSend.scaledWidth = $scope.imgcrop.scaledWidth;
		        $scope.dataToSend.scaledHeight = $scope.imgcrop.scaledHeight;
		        $scope.dataToSend.scaledTop = $scope.imgcrop.scaledTop;
		        $scope.dataToSend.scaledLeft = $scope.imgcrop.scaledLeft;
		        $scope.dataToSend.aspectRatio = $scope.imgcrop.aspectRatio;
		        $scope.dataToSend.landscape = $scope.imgcrop.landscape;
		        $scope.dataToSend.containerWidth = $scope.imgcrop.containerWidth;
		        $scope.dataToSend.containerHeight = $scope.imgcrop.containerHeight;
		        $scope.uploadingImages[$scope.indexImage] = {};
		        $scope.uploadingImages[$scope.indexImage].status = 'start';
		        $scope.uploadingImages[$scope.indexImage].text='0%';
		        $scope.uploadingImages[$scope.indexImage].file=$scope.imgcrop.file;

		        $scope.dataToSend.normalWidth= 800;
            	$scope.dataToSend.normalHeight= 450;
            	if(!$scope.imgcrop.landscape){
            		$scope.dataToSend.normalWidth= 300;
            		$scope.dataToSend.normalHeight= 400;
            	}

                $scope.uploadingImages[$scope.indexImage].status='progress';
                (function(indexImage){
                	$scope.imgcrop.imgEditId = 0;
                	$scope.imgcrop.displayHeight = 0;
					$scope.imgcrop.displayWidth = 0;
					$scope.imgcrop.scaledWidth = 0;
					$scope.imgcrop.scaledHeight = 0;
					$scope.imgcrop.scaledTop = 0;
					$scope.imgcrop.scaledLeft = 0;
					$scope.imgcrop.containerWidth = 0;
					$scope.imgcrop.containerHeight = 0;
					$scope.imgcrop.aspectRatio = '16/9';
					$scope.imgcrop.imgSrc = "";
					$('#imageCropSource').hide();

                    Upload.upload({
                        url: '/api/fabricant/'+$scope.formData.id+'/images',
                        data: {file :$scope.fileToSend}
                        	// 'displayWidth':$scope.dataToSend.displayWidth,
                        	// 'scaledWidth':$scope.dataToSend.scaledWidth,
                        	// 'scaledHeight':$scope.dataToSend.scaledHeight,
                        	// 'scaledTop':$scope.dataToSend.scaledTop,
                        	// 'scaledLeft':$scope.dataToSend.scaledLeft,
                        	// 'aspectRatio':$scope.dataToSend.aspectRatio,
                        	// 'landscape':$scope.dataToSend.landscape,
                        
                    }).then(function (data) {
                    	console.log(data);
                    	console.log(data.data.child);
                    	$rootScope.$broadcast('fabricantSelfChangeImg',data.data.parent);
                    	// $scope.formData.images.push(data.data.child)
                    	$scope.dataToSend.imgid= data.data.child.id;
                    	$scope.dataToSend.filename= data.data.child.filename;
                    	$rootScope.startSpin();
      					$sailsSocket.post('/api/image/resize/',$scope.dataToSend).success(function (data,status) {
				            console.log('SUCCESS RESIZE');
				            $rootScope.stopSpin();
				          
				        }).error(function (data,status) {
				            console.log(data);
				            console.log('errOR');
				        })


                        $scope.uploadingImages[indexImage].text='Envoi terminé';
						$scope.touched = true;

                        (function(indexImage){

                            $timeout(function () {
                                $scope.uploadingImages[indexImage].status = 'success';
                            },3000)
                        })(indexImage)
                    },function (evt) {
                        //HANDLE ERROR
                    },function (evt) {
                        $scope.uploadingImages[indexImage].progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.uploadingImages[indexImage].text = $scope.uploadingImages[indexImage].progressPercentage+'%'
                    });
                })($scope.indexImage)
		        $scope.indexImage++;
		    };
		    $scope.changeOrientation=function(){
		    	if($scope.imgcrop.landscape)
		    	{
		    		$scope.imgcrop.landscape = false;
		    		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPortrait
		    	}else{
		    		$scope.imgcrop.landscape = true;
		    		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPaysage
		    	}
		    }
		    $scope.resizeagain=function(img){
		    	console.log(img);

		    	$scope.imgcrop.imgSrc = 'image/originalSize/'+img.filename;
		    	$scope.imgcrop.imgEditId = img.id;
		    	$scope.imgcrop.filename = img.filename;
				
		    }
		    $scope.imgcrop = {};
		    $scope.imgcrop.imgEditId = 0;
			$scope.imgcrop.displayHeight = 0;
			$scope.imgcrop.displayWidth = 0;
			$scope.imgcrop.scaledWidth = 0;
			$scope.imgcrop.scaledHeight = 0;
			$scope.imgcrop.scaledTop = 0;
			$scope.imgcrop.scaledLeft = 0;
			$scope.imgcrop.containerWidth = 0;
			$scope.imgcrop.containerHeight = 0;
			$scope.imgcrop.aspectRatio = '16/9';
			$scope.imgcrop.imgSrc = "";
			$scope.imgcrop.aspectRatioPaysage = '16/9';
			$scope.imgcrop.aspectRatioPortrait = '3/4';

			
			$scope.addImgCrop=function($files){
				console.log('uploadFiles');
				console.log($files);
				// $scope.imgcrop = {};
				$scope.imgcrop.imgEditId = 0;
				$scope.imgcrop.displayHeight = 0;
				$scope.imgcrop.displayWidth = 0;
				$scope.imgcrop.scaledWidth = 0;
				$scope.imgcrop.scaledHeight = 0;
				$scope.imgcrop.scaledTop = 0;
				$scope.imgcrop.containerWidth = 0;
				$scope.imgcrop.containerHeight = 0;
				$scope.imgcrop.scaledLeft = 0;
				$scope.imgcrop.imgSrc = '';
				$('#imageCropSelector').css({'display':'none'})
					
				// $files[0].$ngfBlobUrl;

				if(typeof($files[0])== 'object'){
					$scope.imgcrop.imgSrc = $files[0].$ngfBlobUrl;
					$('#imageCropSource').show();

					$scope.imgcrop.file = $files[0];
					$scope.$applyAsync();
				    if($files[0].$ngfWidth < $files[0].$ngfHeight)
	            	{
	            		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPortrait;
	            		$scope.imgcrop.landscape = false;
	            	}else{
	            		$scope.imgcrop.aspectRatio = $scope.imgcrop.aspectRatioPaysage;
	            		$scope.imgcrop.landscape = true;
	            	}
				}

			};
			// $scope.uploadDocument=function($files){
			// 	console.log('fileDrop');
			// 	console.log($files);



			// };
			$scope.removeImgCrop = function(){
				console.log('CANCEL IMAGE');
				setTimeout(function(){
					// $('#imageCropSource').attr('src','');
					$('#imageCropSource').hide();
					$scope.imgcrop.imgSrc = '';
					$scope.$applyAsync();
					
				},1)
				// $scope.$applyAsync();
			}
			// $scope.removeImage=function(doc){
			// 	$rootScope.startSpin();
			// 	fabricantService.removeImage($scope.formData.id,doc).then(function(data){
			// 		var index = _.findIndex($scope.formData.documents, function(o) { return o.id == doc; });
			// 		if( index !== -1) {
			// 			$scope.formData.documents.splice(index, 1);
			// 		}
			// 		//  else {
			// 		// 	$scope.formData.tags.push(tag_with_id);
			// 		// }
			// 		$rootScope.stopSpin();
			// 	},function(d){
			// 		console.log('EROOR');
			// 	})
			// }
			$scope.titi = [{name:'riri'},{name:'loulou'},{name:'fifi'},{name:'picsous'}]

			$scope.formData.images = _.orderBy($scope.formData.images,'rank')

			$scope.sortOption={
				'ui-floating':true,
				stop: function(e, ui) {
					console.log('UPDATE');
					console.log($scope.formData.images);
					var allImages = $scope.formData.images
					console.log(allImages);

					for(var i=0; i< allImages.length; i++)
					{
						console.log(i);
						console.log(allImages[i].name);
						$rootScope.startSpin();
						imageService.saveImage(allImages[i].id,{rank:i}).then(function(d){
							$rootScope.stopSpin();
							console.log('cool');
							
						})
					}



					console.log(allImages);
// saveImage
					// imageService.saveIndex($scope.formData.images).then(function(d){

					// 	console.log('cool');
						
					// })

					// console.log($scope.formData.images);
					// console.log(ui);
					// console.log(e);
				    // if (ui.item.sortable.model == "can't be moved") {
				    //     ui.item.sortable.cancel();
				    // }
				},

				start:function(e,ui) {
					console.log('START');
					console.log($scope.formData.images);
				}
			};


			$scope.saveCountry=function($item, $model){
				console.log('TOTOTOTOTTOO');


				console.log($item);
				console.log($model);
				console.log($scope.formData.country);
				$scope.update('country')
			}

			 $scope.country = {};
			 $scope.countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
   
      	},
      	link:function(scope,element,attrs){
      		


			// scope.textAngularOptions={};

			// scope.textAngularOptions = ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo','justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent','html', 'insertImage','insertLink', 'insertVideo'];
		  	// scope.textAngularOptions = [['h1','h2','h3'],['bold','italics']]
      	}
    };

});