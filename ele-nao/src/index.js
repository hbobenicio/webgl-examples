import WebGL from './webgl'

const app = new WebGL.App({
    el: '#canvas',
    vertexShader: '#vertex-shader',
    fragmentShader: '#fragment-shader'
});

app.render();
