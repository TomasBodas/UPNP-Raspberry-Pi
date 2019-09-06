const upnp = require('nat-upnp');
const express = require('express');
const Gpio = require('onoff').Gpio;
let led;
// Observa si los pines GPIO están habilitados para el uso
if (Gpio.accessible) {
  led = new Gpio(26, 'out');
} else {
  led = {
    writeSync: (value) => {
      console.log('virtual led now uses value: ' + value);
    }
  };
}


var client = upnp.createClient();
var app = express();

// Envía a index.html (Frontend con opciones "Turn on, Turn off")
app.get('/',(req,res) => res.sendfile('index.html'))
// "Encendido"
app.get('/on',function (req,res) {
  led.writeSync(Gpio.HIGH);
  res.sendfile('index.html');
})
// "Apagado"
app.get('/off',function (req,res) {
  led.writeSync(Gpio.LOW);
  res.sendfile('index.html');
})
// Deshabilita viejos portforwards
client.portUnmapping({
  public: 12345
});
// Habilitar puerto 12345
client.portMapping({
  public: 12345,
  private: 54321,
  ttl: 10
}, function(err) {
});


// Muestra por consola la IP externa asignada con su puerto
client.externalIp(function(err, ip) {
  client.getMappings(function(err, results) {
    console.log(results)
          pulic_port = results[0].public.port;
    private_port = results[0].private.port;
    app.listen(private_port,()=> console.log('server is running on '+ip+':'+pulic_port))
  });
});

