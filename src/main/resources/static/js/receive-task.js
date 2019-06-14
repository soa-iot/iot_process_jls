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


/**
 * 处理过程表格
 */
//从cookie中获得piid
var piid = GetQueryString("piid");

layui.use('table', function(){
	  var table = layui.table;
	  
	  //第一个实例
	  table.render({
	    elem: '#process-table'
	    ,url: '/iot_process/process/nodes/historyTask/piid/'+piid //数据接口
	   // ,page: true //开启分页
	    ,parseData: function(res) { //res 即为原始返回的数据
	    	//后端返回值： ResultJson<List<Map<String,Object>>>
            return {
                "code": res.state, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.length, //解析数据长度
                "data": res.data //解析数据列表
            }
        }
	    ,cols: [[ //表头
	      {field: 'nodeExecutor', title: '处理人', width:'25%'}
	      ,{field: 'nodeName', title: '处理节点', width:'25%'}
	      ,{field: 'nodeComment', title: '处理说明', width:'25%'}
	      ,{field: 'nodeEndTime', title: '时间', width:'25%',templet:"<div>{{layui.util.toDateString(d.nodeEndTime,'yyyy-MM-dd HH:mm:ss')}}</div>"} 
	    ]]
	  });

});

var tProblemRepId = null;

layui.use(['form', 'jquery','layer'], function(){
  var form = layui.form
  ,	$ = layui.$
  ,layer = layui.layer;
	
  //异步加载初始化页面数据
  $.ajax({
	  type: "GET",
	  url: "/iot_process/estimates/estim",
	  data:{"piid": piid},
	  dataType: "json",
	  success: function(json){
		  if(json.state == 0){
			  tProblemRepId = json.data.tproblemRepId;
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
  
  /**
   *问题图片
   */
 $.ajax({  
 	url : "/iot_process/estimates/problemreportpho",  
 	type : "get",
 	data : {"piid":piid,"remark":0},
 	dataType : "json",  
 	success: function( json) {
 		if (json.state == 0) {
 			var imgs = json.data;
 			if (imgs.length==0) {
				$("#imag").html("无图");
			}else{
 			var mode = imgs.length%3;
 			var img_id = 0;
 			//alert(img[i]);

 			for (var j = 0; j < Math.ceil(imgs.length/3); j++) {
 				var img_div='<div>';
 				if (mode != 0 && j == (Math.ceil(imgs.length/3) - 1) ) {
 					//img_div = '';

 					for (var i = 0; i < mode; i++) {
 						img_div = img_div+'<img alt="图片1" src="'+imgs[img_id].phoAddress+'">';
 						img_id++;
 					}

 				}else{

 					for (var i = 0; i < 3; i++) {
 						img_div = img_div+'<img alt="图片1" src="'+imgs[img_id].phoAddress+'">';
 						img_id++;
 					}

 				}
 				img_div = img_div+'</div>'
 				$("#imag").append(img_div);
 			}
			}
 		}

 	}  
 });
  	
 	//从cookie中获取处理人
    var userName = getCookie1("name").replace(/"/g,'')
	//点击下一步按钮操作
	form.on('submit(next_step)', function(data){
		  
		  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		  $.ajax({  
		    	url : "/iot_process/process/nodes/next/piid/"+piid,   ///iot_process/estimates/problemdescribe
		        type : "PUT",
		        data : {
		        		"comment": data.field.comment,
		        		"userName": userName
		        },
		        contentType: "application/x-www-form-urlencoded",
		        dataType : "json",  
		        success: function(jsonData) {
		        	if(jsonData.data == true){
		        		layer.msg("<i class='layui-icon layui-icon-face-smile'></i> "+"接收作业成功");
		        	}else{
		        		layer.msg("<i class='layui-icon layui-icon-face-cry'></i> "+"接收作业失败");
		        	}
		        } 
		        ,error:function(){
		        	layer.msg("<i class='layui-icon layui-icon-face-cry'></i> "+"接收作业失败");
		        }	
		   });		  
		  
		  //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
   });
		    
});

//弹出层
layui.use('layer', function(){ //独立版的layer无需执行这一句
	var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
	
	//触发事件
	var active = {
			offset: function(othis){
				
			var imgHtml= "<img src='"+$(this).attr("src")+"'width='800px'  height='600px'/>";
				//var type = othis.data('type')
				layer.open({
				type: 1
				//,offset: type 
				,area: ['800px','600px']
				,content: imgHtml
				,title:false
				//,shadeClose:true
				//,cancel:false
				,offset:'auto'
				
				});
			}
	};

	$('.big-img').on('click', function(){
		var othis = $(this), method = othis.data('method');
		active[method] ? active[method].call(this, othis) : '';
	});

});