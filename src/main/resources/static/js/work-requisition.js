/**
 * 日期插件
 */
layui.use('laydate', function(){
	var laydate = layui.laydate;
	//常规用法
	laydate.render({
		elem: '#applydate'
		,format: 'yyyy-MM-dd'
	});
});

//从url中取出piid
var piid = GetQueryString("piid");
piid = '123';

layui.use(['layer', 'form', 'table'], function() {
	var layer = layui.layer, $ = layui.$, form = layui.form;
	var table = layui.table;

	/**
	 * 打印脚手架搭拆申请单
	 */
	form.on('submit(print-page)', function(data){
		console.log("开始打印");
		$("#base").css({"display":"block"})
		fillDate();
		$("#base").print({
			globalStyles: true,
		    mediaPrint: false,
		    stylesheet: null,
		    noPrintSelector: ".no-print",
		    iframe: true,
		    append: null,
		    prepend: null,
		    manuallyCopyFormValues: true,
		    deferred: $.Deferred()
		 }); 
		$("#base").css({"display":"none"});
		console.log("打印结束");
	});
	
	/**
	 * 保存脚手架搭拆申请单
	 */
	form.on('submit(save-page)', function(data){
		console.log("开始保存");
		$.ajax({
			async: false,
			type: 'POST',
			url: '#',
			data: $("form").serialize(),
			dataType: 'json',
			success: function(json){
				if(json.state == 0){
					layer.msg("保存成功",{icon:1, time: 2000, offset: '150px'});
				}else{
					layer.msg("保存失败",{icon:2, time: 2000, offset: '150px'});
				}
			},
			error: function(){
				layer.msg("保存失败， 请检查网路是否正常",{icon:2, time: 2000, offset: '150px'});
			}
		})
	});
	
	/**
	 * 清空表单数据
	 */
	form.on('submit(clean-data)', function(data){
		$(".layui-input").val("");
	});
	
	/**
	 * 脚手架搭拆申请作业单
	 * 根据用户输入值填充工作单
	 */
	function fillDate(){
		$("#applydept_").text($("#applydept").val());
		var arr = $("#applydate").val().split("-");
		if(arr.length < 3){
			arr[0] = arr[1] = arr[2] = '  ';
		}
		$("#applydate_").text(arr[0]+"年"+arr[1]+"月"+arr[2]+"日");
		$("#location_").text($("#location").val());
		$("#applypeople_").text($("#applypeople").val());
		$("#deptowner_").text($("#deptowner").val());
		$("#workdescription_").text($("#workdescription").val());
		$("#tips_").text($("#tips").val());
		$("#action_").text($("#action").val());
		$("#caculator_").text($("#caculator").val());
		$("#workAmount_").text($("#workAmount").val());
		$("#comment_").text($("#comment").val());
	}
	
	/**
	 * 防腐（保温）内容及工作量输入表
	 */
	table.render({
	    elem: '#anticorrosion'
	    ,cols: [[ //标题栏
	      {field:'id', title:'序号', width:50, type:'numbers',align:'center'}
	      ,{field:'content', title:'防腐（保温）内容', width:220, edit: 'text',align:'center'}
	      ,{field:'version', title:'规格型号', edit: 'text', width:100, align:'center'}
	      ,{field:'num', title:'数量', width:80, edit:'text', width:80,align:'center'}
	      ,{field:'comment', title:'备注', edit: 'text', align:'center',width:313}
	    ]]
	    ,data: [{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""},
	    		{"content": "","version": "","num": "","comment": ""}]
	  });	
	
	form.on('submit(print-page1)', function(data){
		console.log("开始打印");
		$("#base").css({"display":"block"})
		fillDate_one();
		$("#base").print({
			globalStyles: true,
		    mediaPrint: false,
		    stylesheet: null,
		    noPrintSelector: ".no-print",
		    iframe: true,
		    append: null,
		    prepend: null,
		    manuallyCopyFormValues: true,
		    deferred: $.Deferred()
		 }); 
		$("#base").css({"display":"none"});
		console.log("打印结束");
	});
	
	/**
	 * 防腐（保温）作业申请单
	 * 根据用户输入值填充工作单
	 */
	function fillDate_one(){
		$("#applydept_").text($("#applydept").val());
		$("#applypeople_").text($("#applypeople").val());
		$("#deptowner_").text($("#deptowner").val());
		$("#requirement_").html($("#requirement").val());
		console.log($("#requirement").val());
		var arr = $("#applydate").val().split("-");
		if(arr.length < 3){
			arr[0] = arr[1] = arr[2] = '  ';
		}
		$("#applydate_").text(arr[0]+"年"+arr[1]+"月"+arr[2]+"日");
		
		$("td .laytable-cell-1-0-1").each(function(index,element){
			$('.content-1')[index].innerText = element.innerText==undefined||element.innerText==''?' ':element.innerText;
		})
		$("td .laytable-cell-1-0-2").each(function(index,element){
			$('.content-2')[index].innerText = element.innerText==undefined||element.innerText==''?' ':element.innerText;
		})
		$("td .laytable-cell-1-0-3").each(function(index,element){
			$('.content-3')[index].innerText = element.innerText==undefined||element.innerText==''?' ':element.innerText;
		})
		$("td .laytable-cell-1-0-4").each(function(index,element){
			$('.content-4')[index].innerText = element.innerText==undefined||element.innerText==''?' ':element.innerText;
		})
		
	}
});
