var successarr = []
var errorarr = []
$('#start').click(function () {
  if ($('#url').val().trim() == '') return layer.msg('必填项不能为空')
  if ($('#shorttype').attr('data-value') == '') return layer.msg('请选择短网址类型')
  $('#success').text(0)
  $('#error').text(0)
  $(this).attr('disabled', true).text('生成中')
  $('tbody').html('')
  var arr = $('#url').val().split('\n')
  arr = arr.filter(item => {
    if (item.trim() != '') {
      return item.trim()
    }
  })
  successarr = []
  errorarr = []
  arr.forEach((item, index) => {
    $('tbody').append(`<tr><td>${item}</td><td id="w${index}"><span style="color:gray">生成中..</span></td></tr>`)
    $.ajax({
      type: 'post',
      url: '//api.dwzjh.com/api/free',
      data: {
        name: $('#shorttype').attr('data-value'),
        url: item
      },
      success: function (data) {
        if (data.code == 200) {
          $('#success').text(parseInt($('#success').text()) + 1)
          successarr.push({
            item: data.data.url,
            index: index
          })
          $(`#w${index}`).html(`<span style="color:green">${data.data.url}</span>`)
        } else {
          $('#error').text(parseInt($('#error').text()) + 1)
          errorarr.push({
            item: item,
            index: index
          })
          $(`#w${index}`).html(`<span style="color:red">${data.msg}</span>`)
        }
        end(arr.length)
      },
      error:function(){
        $('#error').text(parseInt($('#error').text()) + 1)
        errorarr.push({
          item: item,
          index: index
        })
        $(`#w${index}`).html(`<span style="color:red">失败</span>`)
        end(arr.length)
      }
    })
  })
})

function end(num) {
  if (parseInt($('#success').text()) + parseInt($('#error').text()) == num) {
    $('#start').attr('disabled', false).text('开始')
  }
}

function sort(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
      // 相邻元素两两对比，元素交换，大的元素交换到后面
      if (arr[j].index > arr[j + 1].index) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr
}
$('#success').click(function () {
  $('.mtk ul li').eq(0).addClass('current').siblings().removeClass('current')
  $('.bigmt').show()
  var arr = sort(successarr)
  var str = ''
  arr.forEach(item=>{
    str+=item.item +'\n'
  })
  $('.mtk textarea').val(str)
})
$('#error').click(function () {
  $('.mtk ul li').eq(1).addClass('current').siblings().removeClass('current')
  $('.bigmt').show()
  var arr = sort(errorarr)
  var str = ''
  arr.forEach(item=>{
    str+=item.item +'\n'
  })
  $('.mtk textarea').val(str)
})
$('.mtk ul li').click(function () {
  $(this).addClass('current').siblings().removeClass('current')
  if($(this).attr('zh') == 'yc'){
    var arr = sort(errorarr)
    var str = ''
    arr.forEach(item=>{
      str+=item.item +'\n'
    })
  }else{
    var arr = sort(successarr)
    var str = ''
    arr.forEach(item=>{
      str+=item.item +'\n'
    })
  }
  $('.mtk textarea').val(str)
})
$('#closebtn').click(function () {
  $('.bigmt').hide()
})