const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', ()=> {
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('foo')).toEqual(
            "B2213295D564916F89A6A42455567C87C3F480FCD7A1C15E220F17D7169A790B".toLowerCase()
        )
    })

    it('produces the same hash with the same input arguments in any order', ()=> {
        expect(cryptoHash('one','two','three'))
            .toEqual(cryptoHash('three', 'one', 'two'))
    })
    it('produces a unique hash when the properties have changed on input',()=>{
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a'
        expect(cryptoHash(foo)).not.toEqual(originalHash)
    })
})
