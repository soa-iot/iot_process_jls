//轮播图
layui.use(['carousel', 'form'], function(){
	var carousel = layui.carousel
	,form = layui.form;

	//常规轮播
	carousel.render({
		elem: '#problem_image'
		,width: '700px'
		,arrow: 'always'
		,interval: 5000
		,anim: 'default'
		,height: '400px'
	});

});  

//折叠
layui.use([ 'element', 'layer' ], function() {
	var element = layui.element;
	var layer = layui.layer;

});

layui.use(['form', 'jquery','layer'], function(){
  var form = layui.form
  ,	$ = layui.$
  ,layer = layui.layer;
	
  //异步加载初始化页面数据
  $.ajax({
	  type: "GET",
	  url: "/iot_process/estimates/estim",
	  data:{piid: "ADAA80DB601C4470BE8BB224705F5F9C"},
	  dataType: "json",
	  success: function(json){
		  if(json.state == 0){
			  
			//表单初始赋值
			form.val('receive-task', {
			  "incident_sign": json.data.ticketNo
			  ,"remark": json.data.remark
			  ,"sdate": function(){
				  if(json.data.rectificationperiod != null){
					 return json.data.rectificationperiod.match(/\d+-\d+-\d+/)
				  }
			  }
			  ,"applypeople": json.data.applypeople
			  ,"problemtype": json.data.problemtype
			  ,"welName":  json.data.welName
			  ,"profession": json.data.profession
			  ,"rfid": json.data.rfid
			  ,"problemclass": json.data.problemclass
			  ,"problem_describe": json.data.problemdescribe
			})
		  }
	  }
  });
  
  
	//点击下一步按钮操作
	form.on('submit(next_step)', function(data){
		  
		  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		  $.ajax({  
		    	url : "#",   ///iot_process/estimates/problemdescribe
		        type : "post",
		        data : {piid : "ADAA80DB601C4470BE8BB224705F5F9C",problemdescribe:$("#problem_describe").val()},
		        dataType : "json",  
		        success: function( json) {
		        	
		        	if (json.state==1) {
		        		alert(json.message);						
					}
		        }  
		   });		  
		  
		  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
   });
		  
	  
});