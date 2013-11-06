common = {}        
common.startTime = performance.now()
stats = new Stats()
scalefactor = 0.9 # how much to shrink texture after loading
ntex = 20

shrinkTexture = (tex, scale, tn) ->
        im = tex.image
        [newWidth, newHeight] =
                (Math.floor(dim * scale) for dim in [im.width, im.height])

        canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx = canvas.getContext("2d");
        ctx.drawImage(im, 0, 0, im.width, im.height,
                0, 0, newWidth, newHeight)
        
        # _gl.deleteTexture(tex.__webglTexture)        
        tex.image = canvas
        tex.needsUpdate = 1
        fun = -> shrinkTexture(tex, scale)
        # window.setTimeout(fun, 1000)
        console.log("scaled", tn, "to", tex.image.width, "x", tex.image.height)

init = () ->
        if not Detector.webgl
                Detector.addGetWebGLMessage()

        common.camera = camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
        camera.position.y = 150
        camera.position.z = 350

        common.scene = new THREE.Scene()

        textures = {}
        makeCube = (i) ->
                textures[i] = THREE.ImageUtils.loadTexture("big_tex_" + i + ".png", undefined, -> shrinkTexture(textures[i], scalefactor, i))
                cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200),
                new THREE.MeshBasicMaterial({map: textures[i], transparent: true, opacity: 0.5}))
                cube.position.y = 100 + i*20
                #cube.position.z += i*20
                common.scene.add(cube)
                return cube

        common.cubes = []
        common.cubes.push(makeCube(i)) for i in [0..ntex-1]

        container = common.container = document.createElement('div')
        document.body.appendChild(container)

        common.renderer = renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.appendChild(renderer.domElement)

        common.stats = stats = new Stats()
        stats.domElement.style.position = 'absolute'
        stats.domElement.style.top = '0px'
        container.appendChild(stats.domElement)

animate = () ->
        render()
        requestAnimationFrame(animate)
        stats.update()

wiggleCube = (cube, dtime) ->
        cube.rotation.x += 0.02
        cube.rotation.y += 0.0225
        cube.rotation.z += 0.0175

        cube.scale.y = cube.scale.z = cube.scale.x = 1.0 + .3 * Math.sin(dtime/300)

render = () ->
        dtime = Date.now() - common.startTime
        offset = 0
        wiggleCube(c, dtime + 10*offset++) for c in common.cubes
        common.renderer.render(common.scene, common.camera)
        

init()
animate()
