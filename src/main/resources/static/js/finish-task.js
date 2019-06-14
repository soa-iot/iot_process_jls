layui.use(['form', 'jquery','upload','layer'], function(){
  var form = layui.form
  ,	$ = layui.$
  ,layer = layui.layer
  ,upload = layui.upload;
  
  	//从cookie中获取当前登录用户
	var resavepeople = getCookie1("name").replace(/"/g,'');
	//var resavepeople = "孙超";
	console.log("当前登录人为:"+resavepeople);
	//用户编号
	var num = getCookie1("num").replace(/"/g,'');
	//num =123;
	console.log("用户编号为:"+num);
	
	//点击完成按钮操作
	form.on('submit(finish_task)', function(data){
		  
		  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		  $.ajax({  
		    	url : "/iot_process/process/nodes/next/piid/"+piid,   ///iot_process/estimates/problemdescribe
		        type : "put",
		        data : {
	        		"comment": data.field.comment,
	         		"userName": resavepeople
	            },
	            contentType: "application/x-www-form-urlencoded",
		        dataType : "json",  
		        success: function(jsonData) {
		        	if(jsonData.data == true){
		        		//上传问题图片
				   		uploadList.upload();
		        		layer.msg("<i class='layui-icon layui-icon-face-smile'></i> "+"完成作业成功");
		        	}else{
		        		layer.msg("<i class='layui-icon layui-icon-face-cry'></i> "+"完成作业失败");
		        	}
		        } 
		        ,error:function(){
		        	layer.msg("<i class='layui-icon layui-icon-face-cry'></i> "+"完成作业失败");
		        }	
		   });		  
		  
		  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
   });
		  
	//多图片上传功能
    var uploadList = upload.render({
         elem: '#addFinishImg'
         , url: '/iot_process/report/upload'
         , data: {		resavepeople: function(){ return resavepeople;}, 
			  			piid: function(){console.log("piid: "+piid); return piid;},
			  	   		tProblemRepId: function(){ console.log("tProblemRepId: "+tProblemRepId); return tProblemRepId;},
			  			num: function(){ console.log("num: "+num); return num; },
			  			remark: "1"
         			}
         , accept: 'images'
         , number: 3
         , multiple: true
         , auto:false
         , bindAction: '#'
         , choose: function (obj) {
       	  
       	//将每次选择的文件追加到文件队列
         	var files = this.files = obj.pushFile();
         	$("#finish-phos").css({"display":"block"});
         	
          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
          obj.preview(function (index, file, result) {
              console.log(index);
              // $('#imgZmList').append('<li style="position:relative"><img name="imgZmList" src="' + result + '"width="150" height="113"><div class="title_cover" name="imgZmName" onclick="divClick(this)"></div><div class="img_edit layui-icon" onclick="croppers_pic(this)">&#xe642;</div><div class="img_close" onclick="deleteElement(this)">X</div></li>');
              $('#imgZmList').append('<li style="position:relative"><img style="margin:0px; height:150px; width:180px;" name="imgZmList" src="' + result + '"><div class="img_close" onclick="deleteElement(this)">X</div></li>');
              //删除列表中对应的文件
              $(".img_close").click(function(){
             	 delete files[index]; //删除对应的文件
             	 var len = $('#imgZmList').children().length;
             	 if(len <= 0){
             		 $("#finish-phos").css("display", "none");
             	 }
             	 console.log(index);
             	 uploadList.config.elem.next()[0].value = ''; //清空 input file值，以免删除后出现同名文件不可选
              })
              
              form.render();
           });
         }
     	   //上传前执行的函数
         ,before: function(obj){
   	     
   	  }
          //上传完毕后的，回调函数
         , done: function (res, index, upload) {
       	 // layer.closeAll('loading'); //关闭loading
       	  console.log(res);
       	  if(res.state == 0){
       		  delete this.files[index];  //删除上传成功的文件
       	  }else{
       		 // this.error(index, upload);
       	  }
         }
          //上传失败时，回调函数
         ,error: function(index, upload){
       	 // layer.closeAll('loading'); //关闭loading
       	 // upload();   //重新上传
         layer.msg("图片上传失败");
         }
     });
	
});