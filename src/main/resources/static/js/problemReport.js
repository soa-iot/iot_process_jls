	layui.use(['jquery','table','form','laydate','table'], function(){
			var layer = layui.layer,form = layui.form,
				$ = layui.$, //重点处,使用jQuery
				laydate = layui.laydate,table=layui.table;
			console.log(layer);
			function renderTime(param){
				laydate.render({
					elem: param,
					type: 'date',
					trigger: 'click' //采用click弹出
				});
			};
			renderTime('#startTime');
			renderTime('#endTime');
			form.render(); 
			var option = {
				    tooltip : {
				        formatter: "{a} <br/>{c} {b}"
				    },
				    backgroundColor: '#0f375f',
				    toolbox: {
				        show: true,
				        feature: {
				            restore: {show: true},
				            saveAsImage: {show: true}
				        }
				    },
				    grid:{
				    	top:2,
				    	right:2,
				    	left:2,
				    	bottom:2},
				    series : [
				        {
				            name: '完成率',
				            type: 'gauge',
				            z: 3,
				            min: 0,
				            max: 100,
				            splitNumber: 10,
				            radius: '95%',
				            axisLine: {            // 坐标轴线
				                lineStyle: {       // 属性lineStyle控制线条样式
				                    width: 10
				                }
				            },
				            axisTick: {            // 坐标轴小标记
				                length: 15,        // 属性length控制线长
				                lineStyle: {       // 属性lineStyle控制线条样式
				                    color: 'auto'
				                }
				            },
				            splitLine: {           // 分隔线
				                length: 20,         // 属性length控制线长
				                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
				                    color: 'auto'
				                }
				            },
				            axisLabel: {
				                backgroundColor: 'auto',
				                borderRadius: 2,
				                color: '#eee',
				                padding: 3,
				                textShadowBlur: 2,
				                textShadowOffsetX: 1,
				                textShadowOffsetY: 1,
				                textShadowColor: '#222'
				            },
				            title : {
				                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                top:60,
				                fontWeight: 'bolder',
				                fontSize: 20,
				                fontStyle: 'italic'
				            },
				            detail : {
				                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                formatter: function (value) {
				                    value = (value + '').split('.');
				                    value.length < 2 && (value.push('00'));
				                    return ('00' + value[0]).slice(-2)
				                        + '.' + (value[1] + '00').slice(0, 2);
				                },
				                fontWeight: 'bolder',
				                borderRadius: 3,
				                backgroundColor: '#444',
				                borderColor: '#aaa',
				                shadowBlur: 5,
				                shadowColor: '#333',
				                shadowOffsetX: 0,
				                shadowOffsetY: 3,
				                borderWidth: 2,
				                textBorderColor: '#000',
				                textBorderWidth: 2,
				                textShadowBlur: 2,
				                textShadowColor: '#fff',
				                textShadowOffsetX: 0,
				                textShadowOffsetY: 0,
				                fontFamily: 'Arial',
				                width: 60,
				                color: '#eee',
				                rich: {}
				            },
				            data:[{value: 100, name: '完成率'}]
				        }
				       
				    ]
				};
			var myChart = echarts.init($('.complate-rate')[0]);
			var Baroption = {
				   grid:{
				    	top:30,
				    	right:30,
				    	left:30,
				    	bottom:30},
				    backgroundColor: '#0f375f',
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'shadow'
				        }
				    },
				    legend: {
				        data: ['总量', '已整改', '未整改'],
				        textStyle: {
				            color: '#ccc'
				        }
				    },
				    xAxis: {
				       // data: category,
				        axisLine: {
				            lineStyle: {
				                color: '#ccc'
				            }
				        }
				    },
				    yAxis: {
				        splitLine: {show: false},
				        axisLine: {
				            lineStyle: {
				                color: '#ccc'
				            }
				        }
				    },
				    series: [  {
				        name: '总量',
				        type: 'bar',
				        barWidth: 10,
				        itemStyle: {
				            normal: {
				                barBorderRadius: 5,
				                color: new echarts.graphic.LinearGradient(
				                    0, 0, 0, 1,
				                    [
				                        {offset: 0, color: '#14c8d4'},
				                        {offset: 1, color: '#43eec6'}
				                    ]
				                )
				            }
				        }
				       
				    }, {
				        name: '已整改',
				        type: 'bar',
				        barWidth: 10,
				        itemStyle: {
				            normal: {
				                barBorderRadius: 5,
				                color: new echarts.graphic.LinearGradient(
				                    0, 0, 0, 1,
				                    [
				                        {offset: 0, color: '#14c8d4'},
				                        {offset: 1, color: '#43eec6'}
				                    ]
				                )
				            }
				        }
				      
				    }, {
				        name: '未整改',
				        type: 'bar',
				        barWidth: 10,
				        itemStyle: {
				            normal: {
				                barBorderRadius: 5,
				                color: new echarts.graphic.LinearGradient(
				                    0, 0, 0, 1,
				                    [
				                        {offset: 0, color: '#14c8d4'},
				                        {offset: 1, color: '#43eec6'}
				                    ]
				                )
				            }
				        }
				       
				    }]
				};
			var myChart1 = echarts.init($('.complate-show')[0]);
			
			var tableConfig={
				    elem: '#problemReport'
					    ,title: '问题统计表'
					    ,cols: [[
					      ,{ title:'净化工段',colspan:3,align:'center'}
					      ,{ title:'维修工段',colspan:3,align:'center'}
					      ,{ title:'HSE办',colspan:3,align:'center'}
					      ,{ title:'生产办',colspan:3,align:'center'}
					      ,{ title:'设备办',colspan:3,align:'center'}
					      ,{ title:'综合办',colspan:3,align:'center'}
					      ,{ title:'财务办',colspan:3,align:'center'}
					    ],[
						      {field:'jc-total', title:'总量'}
						      ,{field:'jc-finished', title:'已整改',minWidth:75}
						      ,{field:'jc-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'jh_check'}
						      ,{field:'wx-total', title:'总量'}
						      ,{field:'wx-finished', title:'已整改',minWidth:75}
						      ,{field:'wx-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'wx_check'}
						      ,{field:'hse-total', title:'总量'}
						      ,{field:'hse-finished', title:'已整改',minWidth:75}
						      ,{field:'hse-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'hse_check'}
						      ,{field:'sc-total', title:'总量'}
						      ,{field:'sc-finished', title:'已整改',minWidth:75}
						      ,{field:'sc-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'sc_check'}
						      ,{field:'sb-total', title:'总量'}
						      ,{field:'sb-finished', title:'已整改',minWidth:75}
						      ,{field:'sb-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'sb_check'}
						      ,{field:'zh-total', title:'总量'}
						      ,{field:'zh-finished', title:'已整改',minWidth:75}
						      ,{field:'zh-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'zc_check'}
						      ,{field:'cw-total', title:'总量'}
						      ,{field:'cw-finished', title:'已整改',minWidth:75}
						      ,{field:'cw-unfinished', title:'未整改',minWidth:75, style:'cursor: pointer;background-color: #5FB878; color: #fff;',event: 'cw_check'}
					    ]]
						
					  };
			//统计问题情况
			var tableData;
			function changeTableDate(para,area){
				if(para.PROBLEMSTATE=='UNFINISHED'){
					tableData[0][area+"-unfinished"]+=parseInt(para.COUNT);
				}else{
					tableData[0][area+"-finished"]+=parseInt(para.COUNT);
				}
				tableData[0][area+"-total"]+=parseInt(para.COUNT);
			}
			//设置柱状图数据
			var xtotal;
			var xfinished;
			var xunfinished;
			function setBarData(n,i){
				if(n.PROBLEMSTATE=="FINISHED"){
					xfinished[i]=n.COUNT;
				}else{
					xunfinished[i]=n.COUNT
				};
				xtotal[i]+=n.COUNT;
			};
			$("#generateTestData").click(function(){
				var total=0, finished=0;
				$.getJSON('/iot_process/report/problemCount',{'beginTime':$('#startTime').val(),'endTime':$('#endTime').val()},function(aj){
					if(aj.state==0){
						//初始化基本数据
						tableData=[{
						    "jc-total":0
						    ,"jc-finished": 0
						    ,"jc-unfinished": 0
							,"wx-total":0
							,"wx-finished": 0
							,"wx-unfinished": 0
							,"hse-total":0
							,"hse-finished": 0
							,"hse-unfinished": 0
							,"sb-total":0
							,"sb-finished": 0
							,"sb-unfinished": 0
							,"zh-total":0
							,"zh-finished": 0
							,"zh-unfinished": 0
							,"cw-total":0
							,"cw-finished": 0
							,"cw-unfinished": 0
							,"sc-total":0
							,"sc-finished": 0
							,"sc-unfinished": 0
						  }];
						 xAxisdata=["净化工段","维修工段","HSE办公室","财务经营办公室","综合办","设备办","生产办"];
						 xtotal=[0,0,0,0,0,0,0];
						 xfinished=[0,0,0,0,0,0,0];
						 xunfinished=[0,0,0,0,0,0,0];
						 useData=aj.data;
						//根据获取的数据进行分析
						$.each(useData,function(i,n){
							total+=parseInt(n.COUNT);
							if(n.PROBLEMSTATE=='FINISHED'){
								finished+=parseInt(n.COUNT);
							};
						
							switch (n.AREA){
							case '净化工段':
								setBarData(n,0);
								changeTableDate(n,'jc');
								break;
							case '维修工段':
								setBarData(n,1);
								changeTableDate(n,'wx');
								break;
							case 'HSE办公室':
								setBarData(n,2);
								changeTableDate(n,'hse');
								break;
							case '财务经营办公室':
								setBarData(n,2);
								changeTableDate(n,'cw');
								break;
							case '设备办':
								setBarData(n,5);
								changeTableDate(n,'sb');
								break;
							case '生产办':
								setBarData(n,6);
								changeTableDate(n,'sc');
								break;
							case '综合办':
								setBarData(n,4);
								changeTableDate(n,'zh');
								break;
							}
						});
						if(aj.data.length==0){
							total=1;
						}
						var value=(finished/total*100).toFixed(2);
						option.series[0].data[0].value=value;
						Baroption.xAxis.data=xAxisdata;
						Baroption.series[0].data=xtotal;
						Baroption.series[1].data=xfinished;
						Baroption.series[2].data=xunfinished;
						myChart.setOption(option);
						myChart1.setOption(Baroption);
						tableConfig.data=tableData;
						table.render(tableConfig);

					}
				})
			});
			//未闭环问题展示
			var unfinishedProblem=table.render({
				    	elem: '#unfinishedProblem'
				    	,url:'/iot_process/report/showproblembycondition'
				    	,method:'post'
				        ,height: 420
				        ,page: true //开启分页
						,request: {
						    pageName: 'page' //页码的参数名称，默认：page
						    ,limitName: 'limit' //每页数据量的参数名，默认：limit
						}
				        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
				        ,cols: [[{field:'id', title:'编号', width:'5%', sort:false, type:'numbers', fixed:'left', align:'center'},
							{field:'applydate', title:'上报日期', width:'10%', sort:true, align:'center'},    //, templet:"<div>{{layui.util.toDateString(d.applydate,'yyyy-MM-dd HH:mm:ss')}}</div>"
							{field:'applypeople', title:'上报人', width:'10%', sort:true, align:'center'},
							{field:'problemdescribe', title:'描述', width:'25%', sort:true, align:'center'},
							{field:'maintenanceman', title:'责任人', width:'10%', sort:true, align:'center'}]]  
				      });
			function  reloadTable(problemType){
				unfinishedProblem.reload({
		    		url: '/iot_process/report/showproblembycondition'
		    	    ,page: {
		    	    		   curr: 1 //重新从第 1 页开始
		    	    	   }
		    		,where:{
		    		'startTime':$('#startTime').val(),
		    		'endTime':$('#endTime').val(),
		    		'problemType':problemType,
		    		'problemState':'UNFINISHED'
		    			}
		    	    });
			};
			function openLayer(){
				layer.open({
					  type: 1,
					  content: $('#id'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					  cancel: function(){ 
						  $('#unfinishedProblem').hide();
						    return true 开启该代码可禁止点击该按钮关闭
						  }
					});
			}

			//表格监听事件
			table.on('tool(problemReport)', function(obj){
				var data=obj.data;
				switch(obj.event){
				case 'cw_check':
					reloadTable('财务经营办');
					openLayer();
					break;
				case 'hse_check':
					reloadTable('HSE办公室');
					openLayer();
					break;
				case 'sb_check':
					reloadTable('设备办');
					openLayer();
					break;
				case 'jh_check':
					reloadTable('净化工段');
					openLayer();
					break;
				case 'zh_check':
					reloadTable('综合办');
					openLayer();
					break;
				case 'wx_check':
					reloadTable('维修工段');
					openLayer();
					break;
				case 'sc_check':
					reloadTable('生产办');
					openLayer();
					break;
				}
	
			})
		});		 