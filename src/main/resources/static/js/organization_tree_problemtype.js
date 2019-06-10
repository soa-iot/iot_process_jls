

var era = GetQueryString('era');
/**
 * 获取url中的参数
 * @param name 需要的参数名称
 * @returns 参数值
 */
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}
console.log(era);
var tree1 ;
	//数据初tree数据声明
	var tree_data=[];
	$.ajax({  
		url : "http://localhost:10238/iot_usermanager/user/roleName",  
		type : "get",
		data : {roleName:era},
		dataType : "json",  
		success: function( json) {
			if (json.state == 0) {
				var datapro = json.data;
				//数据初始化
				tree_data = buildTree(datapro);
//console.log(tree_data);

				//tree
				layui.use('tree', function(){
					var tree = layui.tree
					,layer = layui.layer
					,data = [{label: era
						//,id: 1
						,children: tree_data}];

					tree1 = tree.render({

						elem: '#work_plan_tree1'
							,data: data
							,showCheckbox: true
							
					})

				});

			}

		}  
	});
	
	console.log(era);
	/**
	 * 获取选中的数据
	 * @return {}
	 */
	function getCheckedData(){
		var checkData = tree1.getChecked('id');
		return checkData;
	}
	
	/*var check = tree1.getChecked(); //获得被勾选的节点

	for (var i = 0; i < check.length; i++) {
		usernames += check[i][0].innerText;
		if (i!=check.length-1) {
			usernames +=",";
		}
	}

	workPlan(obj,usernames);

	console.log(usernames);

	layer.closeAll();*/
	
	