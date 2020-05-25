const packer = {
  pack: function (fText) {
    let deflated16Bit = this.deflated16bit(encodeURI(fText));
    deflated16Bit = this.escZero(deflated16Bit);
    return this.ab2str(deflated16Bit);
  },
  unpack: function (sText) {
    let deflated16Bit = new Uint16Array(this.str2ab(sText));
    deflated16Bit = this.escZero(deflated16Bit, false);
    let inflated8Bit = pako.inflate(deflated16Bit);
    return decodeURI(this.ab2str(inflated8Bit));
  },
  deflated16bit: function (text) {
    let deflated8Bit = pako.deflate(text);
    return new Uint16Array(deflated8Bit);
  },
  escZero: function (in16BitArray, enc = true) {
    return in16BitArray.map((ele) => {
      return ele + (enc ? 0x0C05 : -0x0C05);
    });
  },
  ab2str: function (buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  str2ab: function (str) {
    let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    let bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}



/*function compress(text) {
    var byteArray = new TextEncoder().encode(text);
    var cs = new CompressionStream('deflate'); // 'deflate' or 'gzip'
    var writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer();
}

function decompress(byteArray) {
    var cs = new DecompressionStream('deflate');
    var writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
        return new TextDecoder().decode(arrayBuffer);
    });
}
*/
/*
var test = "http://www.ScriptCompress.com - Simple Packer/Minify/Compress JavaScript Minify, Fixify & Prettify 75 JS Obfuscators In 1 App 25 JS Compressors (Gzip, Bzip, LZMA, etc) PHP, HTML & JS Packers In 1 App PHP Source Code Packers Text Packer HTML Packer or v2 or v3 or LZW Twitter Compress or More Words DNA & Base64 Packer (freq tool) or v2 JS JavaScript Code Golfer Encode Between Quotes Decode Almost Anything Password Protect Scripts HTML Minifier v2 or Encoder or Escaper CSS Minifier or Compressor v2 SVG Image Shrinker HTML To: SVG or SVGZ (Gzipped) HTML To: PNG or v2 2015 JS Packer v2 v3 Embedded File Generator Extreme Packer or version 2 Our Blog DemoScene JS Packer Basic JS Packer or New Version Asciify JavaScript Escape JavaScript Characters UnPacker Packed JS JavaScript Minify/Uglify Text Splitter/Chunker Twitter, Use More Characters Base64 Drag 'n Drop Redirect URL DataURI Get Words Repeated LZMA Archiver ZIP Read/Extract/Make BEAUTIFIER & CODE FIXER WHAK-A-SCRIPT JAVASCRIPT MANGLER 30 STRING ENCODERS CONVERTERS, ENCRYPTION & ENCODERS 43 Byte 1px GIF Generator Steganography PNG Generator WEB APPS VIA DATAURL OLD VERSION OF WHAK PAKr Fun Text Encrypt Our Google";

console.time('compress');
compress(test).then(function (x) {
  console.timeEnd('compress');
  console.log('compressed length', x.byteLength);
  console.time('decompress');
  decompress(x).then(function (y) {
    console.timeEnd('decompress');
    console.log('decompressed length', y.length);
    console.assert(test === y);
  });
});*/