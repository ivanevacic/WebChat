var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', ()=> {
  it('shoud generate correct message object', ()=> {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBe('number');//verify if property is number
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', ()=>{
  it('should generate correct location object', ()=>{
    var from = 'Deb';
    var latitude = 15;
    var longitude = 19;
    var url = 'https://www.google.com/maps?q=15,19';
    var message = generateLocationMessage(from, latitude, longitude);

    ///assertion
    expect(message.createdAt).toBe('number');//verify if property is number
    expect(message).toInclude({from, url});
  });
});