class App {
    constructor(props) {
        this.canvas = document.querySelector(props.el);
        this.vertexShaderEl = document.querySelector(props.vertexShader);
        this.fragmentShaderEl = document.querySelector(props.fragmentShader);
        this.setup();
    }

    setup() {
        this.initGL();
        this.initShaders();
        this.initProgram();
    }

    initGL() {
        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) {
            console.warn('WebGL não suportado. tentando o experimental-gl...');
            this.gl = this.canvas.getContext('experimental-webgl');
        }
        if (!this.gl) {
            alert('Seu navegador não suporta WebGL. Abortando.');
            throw new Error('WebGL não suportado.');
        }
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    initShaders() {
        this.initVertexShader();
        this.initFragmentShader();
    }

    initVertexShader() {
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);

        this.gl.shaderSource(this.vertexShader, this.vertexShaderEl.innerText);

        this.gl.compileShader(this.vertexShader);
        if (!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) {
            console.error('Erro ao compilar vertex shader:', this.gl.getShaderInfoLog(this.vertexShader));
            throw new Error('Não foi possível compilar shaders');
        }
    }

    initFragmentShader() {
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(this.fragmentShader, this.fragmentShaderEl.innerText);

        this.gl.compileShader(this.fragmentShader);
        if (!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) {
            console.error('Erro ao compilar fragment shader:', this.gl.getShaderInfoLog(this.fragmentShader));
            throw new Error('Não foi possível compilar shaders');
        }
    }

    initProgram() {
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Erro ao linkar programa:', this.gl.getProgramInfoLog(this.program));
            throw new Error('Program Error');
        }

        this.gl.validateProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
            console.error('Erro validar programa:', this.gl.getProgramInfoLog(this.program));
            throw new Error('Program Validation Error');
        }
    }

    render() {
        // Buffer Setup
        const triangleVertices = [
            //X, Y     R G B
            0.0, 0.5, 1.0, 1.0, 0.0,
            -0.5, -0.5, 0.7, 0.0, 1.0,
            0.5, -0.5, 0.1, 1.0, 0.6
        ];

        const triangleVertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);

        const positionAttribLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        const colorAttribLocation = this.gl.getAttribLocation(this.program, 'vertColor');

        this.gl.vertexAttribPointer(
            positionAttribLocation, // Attribute Location
            2, // Number of elements per attribute
            this.gl.FLOAT, // Type of elements
            this.gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0// Offset of the beginning of a single vertex to this attribute
        );

        this.gl.vertexAttribPointer(
            colorAttribLocation, // Attribute Location
            3, // Number of elements per attribute
            this.gl.FLOAT, // Type of elements
            this.gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset of the beginning of a single vertex to this attribute
        );

        this.gl.enableVertexAttribArray(positionAttribLocation);
        this.gl.enableVertexAttribArray(colorAttribLocation);

        // Main Draw Loop
        this.gl.useProgram(this.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
};

export default App;
