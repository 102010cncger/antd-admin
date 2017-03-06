const Ajax = require('robe-ajax')

export default function request (url, options) {
  if (options.cross) {
    return Ajax.getJSON('http://query.yahooapis.com/v1/public/yql', {
      q: "select * from json where url='" + url + '?' + Ajax.param(options.data) + "'",
      format: 'json'
    })
  } else {
    return Ajax.ajax({
      url: url,
      method: options.method || 'get',
      data: options.data || {},
      processData: options.method === 'get',
      dataType: 'JSON',
      headers: {
        "Authorization": "Token " + localStorage.getItem('authToken'),
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).done((data) => {
      return data
    })
  }
}
