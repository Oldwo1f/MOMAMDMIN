/**
 * Document.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var fs = require('fs'), Writable = require('stream').Writable;
module.exports = {

  	schema: true,
  	attributes: {
  		filename:{type:'string',required:true},
  		name:{type:'string',required:true},
  		description:{type:'text',defaultsTo:''},
  		date:{type:'date'},
  		nbDowload:{type:'int'},
  		size:{type:'int'},
  		type:{type:'string'},
        selfUpdate:function(options,cb,res){
            if(options.parentType == 'article')
            {
                if(options.verb == 'add'){
                   Document.findOne(this.id).then(function(data){
                        // data.nbArticles= Number(data.nbArticles)+1;
                        // data.total= Number(data.total)+1;
                        // console.log(data);
                        // return Tag.update(data.id ,
                        // {
                        //     // nbArticles : data.nbArticles,
                        //     total : data.total
                        // }).then(function(result){
                        //     console.log(result[0]);
                            cb(null,data);
                            
                        // })
                       
                    }).catch(function (err) {
                        cb(err,null);
                    });
                }
      
                if(options.verb == 'remove'){
                    Document.destroy(this.id).then(function(data){
                                cb(null,data);
                      
                    }).catch(function (err) {
                        cb(err,null);
                    });
                }
            }
            if(options.parentType == 'slide')
            {
                if(options.verb == 'add'){
                   Document.findOne(this.id).then(function(data){
                            cb(null,data);
                       
                    }).catch(function (err) {
                        cb(err,null);
                    });
                }
      
                if(options.verb == 'remove'){
                  	Document.destroy(this.id).then(function(data){
                                cb(null,data);
                    	
                    }).catch(function (err) {
                        cb(err,null);
                    });
                }
            }
      }
	},
    afterCreate: function (value, callback){

        es.create('document',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
 
    },
    afterUpdate: function (value, callback){

        es.update('document',value).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
    afterDestroy: function (value, callback){
        try{
	        fs.unlink('uploads/files/'+value[0].filename)
	    }catch(e){

	    }



        es.delete('document',value[0]).then(function(){
            return callback()
        }).catch(function(err){
               console.log(err);
        })
    },
};

