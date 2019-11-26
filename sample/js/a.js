var xhr = new XMLHttpRequest()
xhr.open('GET', '/a/c', true)
xhr.send()
xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
        console.log(xhr.responseText)
    }
}