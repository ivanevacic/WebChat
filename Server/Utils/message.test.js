var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', ()=> {
  it('shoud generate correct message object', ()=> {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createdAt).to.be.a('number');//verify if property is number
    expect(message).toInclude({from, text});
  });
});