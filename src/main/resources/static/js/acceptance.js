
/**作业验收*/

/**
 * 全局变量——piid
 */
var piidp = GetQueryString('piid');

/**
 * 全局变量——属地单位
 */
var area = GetQueryString('area');

/**
 * 轮播图
 */
layui.use(['carousel', 'form'], function(){
	var carousel = layui.carousel
	,form = layui.form;

	//常规轮播
	carousel.render({
		elem: '#doimg-div'
		//,arrow: 'always'
			//,width: '778px'
		,height: '150px'
		,interval: 5000
	});
});  


/**
 *作业完成图片
 */
$.ajax({  
	url : "/iot_process/estimates/problemreportpho",  
	type : "get",
	data : {piid : piidp,remark:1},
	dataType : "json",  
	success: function( json) {
		//console.log(json.state);
		if (json.state == 0) {
			var imgs = json.data;
			var mode = imgs.length%3;
			var img_id = 0;


			for (var j = 0; j < Math.ceil(imgs.length/3); j++) {
				var img_div='<div  class="img_p">';
				if (mode != 0 && j == (Math.ceil(imgs.length/3) - 1) ) {
					//img_div = '';
					for (var i = 0; i < mode; i++) {
						img_div = img_div+'<img class="big-img"  data-method="offset" alt="图片1" src="'+imgs[img_id].phoAddress+'">';
						img_id++;
					}

				}else{

					for (var i = 0; i < 3; i++) {
						img_div = img_div+'<img class="big-img"  data-method="offset" alt="图片1" src="'+imgs[img_id].phoAddress+'">';
						img_id++;
					}

				}
				img_div = img_div+'</div>'
				$("#doimg").append(img_div);
			}
		}

	}  
});

/**
 * 作业验收——闭环处理
 * @returns
 */

$("#complete").click(function(){

	if ($("#comment").val()=="") {
		layer.msg("处理说明不能为空",{icon:7});
	}else{

		$.ajax({
			type: "PUT"
			,url: '/iot_process/process/nodes/next/group/piid/'+piidp    //piid为流程实例id
			,data: {

				"comment": $("#comment").val()     //节点的处理信息

			}   //问题上报表单的内容
			,contentType: "application/x-www-form-urlencoded"
			,dataType: "json"
			,success: function(jsonData){
				//后端返回值： ResultJson<Boolean>
				
				if (jsonData.data) {
					layer.msg("闭环处理成功！",{time: 3000,icon:1},function() {
						location.href = getUrlIp()+"/iot_usermanager/html/userCenter/index.html";
					});
				}else{
					layer.msg("闭环处理失败！！",{icon:2});
				}
			},
				//,error:function(){}		       
		});
	}

})