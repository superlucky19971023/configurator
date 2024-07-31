/**
 * Adds 2d/3d objects on the canvas.
 * This library was designed to build a 3D product configurator. It was initiated and built by the Ahime team.
 * It is available on the website https://blyd3d.com.
 * @class BLYD3D
 * @since 1.0.0
 * @link https://blyd3d.com
 * @author Nahim SALAMI
 * @memberof Ahime
 * @mail nahim.salami@ahimee.com, nahim.salami@outlook.fr, marcjeoge@gmail.com
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as THREE from 'three'
import { OrbitControls, RoundedBoxGeometry, FBXLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { getSubdiviseSizes } from './2dGridBuilder'
import { alupco } from './alupcoWindow.json'
import LabelHelper from './LabelHelper.js'
import { getParentByKey } from './utils'
import {
  resizeObject,
  resizeFixedWindow,
  resize2T2SWindow,
  // resize2T3SWindow,
  // resize2T4SWindow,
  // resize3T3SWindow,
  // resize3T6SWindow,
  // resize4T4SWindow,
  // resize4T8SWindow,
  resizeWindow,
  hideModelPart,
  hideModelBar
} from './3dAlupcoWindows'
import GlazingSelect from './GlazingSelect'

const BLYD3D = ({ selector }) => {
  const scene = useRef(null),
    camera = useRef(null),
    controls = useRef(null),
    renderer = useRef(null),
    currentObj = useRef([]),
    savedModel = useRef([]),
    canvasSelector = useRef(null),
    isInit = useRef(false),
    mouse = useRef(null),
    selected = useRef(null)

  const animate = useCallback(() => {
    requestAnimationFrame(animate)
    renderer.current.render(scene.current, camera.current)
  }, [])

  const dispatch = useDispatch()
  const {
    modelSize,
    mainURL,
    handleURL,
    profile,
    aluminumType,
    aluminumColor,
    openingType,
    glazing,
    glassColor,
    glassOpacity,
    glassRoughness,
    border,
    modalFlag
  } = useSelector((state) => state.model)

  const [mainModelPath,setMainModelPath] = useState(mainURL);
  /**
   * Initializes the basic functionality.
   */
  const init = useCallback(() => {
    canvasSelector.current = document.querySelector(selector)
    isInit.current = true
    renderer.current = new THREE.WebGLRenderer({ antialias: true })
    scene.current = new THREE.Scene()
    scene.current.background = new THREE.Color(0xa0a0a0)
    scene.current.fog = new THREE.Fog(0xa0a0a0, 10, 50)
    const environmentTexture = new THREE.CubeTextureLoader()
      .setPath('../../backgrounds/inside/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
    scene.current.environment = environmentTexture
    scene.current.background = environmentTexture

    camera.current = new THREE.PerspectiveCamera(45, canvasSelector.current.offsetWidth / canvasSelector.current.offsetHeight, 0.1, 100000)
    renderer.current.setSize(canvasSelector.current.offsetWidth, canvasSelector.current.offsetHeight)
    renderer.current.setPixelRatio(window.devicePixelRatio)
    renderer.current.setClearColor(0xfefefe)
    renderer.current.toneMapping = THREE.CineonToneMapping
    renderer.current.shadowMap.enabled = true
    renderer.current.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.current.outputEncoding = THREE.GammaEncoding

    canvasSelector.current.appendChild(renderer.current.domElement)

    controls.current = new OrbitControls(camera.current, renderer.current.domElement)
    controls.current.target.set(0, 0, 0)
    controls.current.minPolarAngle = 0 // Minimum polar angle (vertical rotation)
    controls.current.maxPolarAngle = THREE.MathUtils.degToRad(90) // Maximum polar angle (vertical rotation)
    controls.current.update()

    camera.current.position.set(0, 0, 50)
    // camera.current.shadowMap.setType(THREE.PCFSoftShadowMap); // For soft shadows
    // camera.current.shadowMap.setType(THREE.PCFShadowMap); // For sharp shadows

    addLight()

    const hInput = [],
      vInput = [],
      hhInput = [],
      vvInput = []

    function buildDrawObject() {
      let isFieldEmpty = false

      document.querySelectorAll('.blyd3d-grid-input-field').forEach((e) => {
        const gridInput = e.attributes.getNamedItem('gridInput')
        const gridInputId = e.attributes.getNamedItem('data-index')

        if (gridInput) {
          const inputValue = e.value

          if (inputValue == '') {
            isFieldEmpty = true
            e.style.borderColor = 'red'
          }

          if (gridInput.value === 'height') {
            hhInput.push({ height: inputValue, id: gridInputId.value })
          } else if (gridInput.value === 'width') {
            vvInput.push({ width: inputValue, id: gridInputId.value })
          }
        }
      })

      hhInput
        .sort((a, b) => a.id - b.id)
        .forEach((h) => {
          hInput.push(h.height)
        })

      vvInput
        .sort((a, b) => a.id - b.id)
        .forEach((w) => {
          vInput.push(w.width)
        })

      if (!isFieldEmpty) {
        removeAllObjects()
        render()

        document.querySelector('.blyd3d-modal-panel').classList.add('blyd3d-hide')
      }
    }

    document.getElementById('blyd3d-step-done').addEventListener('click', function () {
      if (this.getAttribute('data-action') == 'default') buildDrawObject()
    })

    loadItemSelect()

    render()
  }, [])

  // useEffect(() => {
  //     if (!isInit.current) init();
  //     return () => {};
  //   }, [init]);

  useEffect(() => {
    if (!isInit.current) {
      init()
      animate()
    }

    // Nettoyer la scène lors du démontage du composant
    return () => {
      // Nettoyer les ressources
      if (renderer.current) {
        renderer.current.dispose()
        // renderer.current.forceContextLoss();
        renderer.current.context = null
        renderer.current.domElement = null
      }
      // Détacher les écouteurs d'événements, etc.
    }
  }, [init, animate])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous' // Set cross-origin property

    let texture, tempMaterial
    if (aluminumType.includes('Coating')) {
      loader.load(
        '/materials/coating.png',
        function (texture) {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          texture.needsUpdate = true

          // console.log(aluminumColor)
          scene.current.traverse((object) => {
            if (object.isMesh && !object.material.name.includes('HANDL') && !object.material.name.includes('GLZ')) {
              // UnwrapUVs(object.geometry);
              object.material.map = texture
              if (aluminumColor !== '') {
                object.material.color = new THREE.Color().set(aluminumColor)
              }
            }
          })
          render()
        },
        function (progress) {
          console.log('Texture loading progress:', progress)
        },
        function (error) {
          console.error('Error loading texture:', error)
        }
      )
    } else if (aluminumType.includes('Anodized')) {
      // console.log('anodized')
      loader.load(
        '/materials/silver.png',
        function (texture) {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          texture.needsUpdate = true

          scene.current.traverse((object) => {
            if (object.isMesh && !object.material.name.includes('HANDL') && !object.material.name.includes('GLZ')) {
              // UnwrapUVs(object.geometry);
              object.material.map = texture
              if (aluminumColor !== '') {
                object.material.color = new THREE.Color().set(aluminumColor)
              }
            }
          })
          render()
        },
        function (progress) {
          console.log('Texture loading progress:', progress)
        },
        function (error) {
          console.error('Error loading texture:', error)
        }
      )
    } else {
      // console.log('wooden')
      loader.load(
        '/materials/wooden.png',
        function (texture) {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          texture.needsUpdate = true

          scene.current.traverse((object) => {
            if (object.isMesh && !object.material.name.includes('HANDL') && !object.material.name.includes('GLZ')) {
              object.material.map = texture
              if (aluminumColor !== '') {
                object.material.color = new THREE.Color().set(aluminumColor)
              }
            }
          })
          render()
        },
        function (progress) {
          console.log('Texture loading progress:', progress)
        },
        function (error) {
          console.error('Error loading texture:', error)
        }
      )
    }

    // console.log(texture)
  }, [aluminumType, aluminumColor])

  useEffect(() => {
    scene.current.traverse((object) => {
      if (object.isMesh && object.material.name.includes('HANDL')) {
        // Load the GLB model
        const loader = new GLTFLoader()
        loader.setCrossOrigin('anonymous');
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = handleURL;
        const finalUrl = proxyUrl + targetUrl;
        loader.load(
          finalUrl,
          function (gltf) {
            object.geometry = gltf.scene.children[0].geometry
            object.material = gltf.scene.children[0].material
          },
          function (error) {
            console.log('An error happened')
          }
        )
      }
    })
  }, [handleURL])

  useEffect(() => {
    scene.current.traverse((object) => {
      if (object.isMesh && object.name.includes('BRDR')) {
        object.visible = border
      }
    })
  }, [border])

  useEffect(() => {
    scene.current.traverse((object) => {
      if (object.isMesh && object.material.name.includes('GLZ')) {
        const glassMaterial = new THREE.MeshStandardMaterial({
          color: glassColor, // Set the color to white (RGB: 255, 255, 255)
          transparent: true, // Enable transparency for the glass material
          opacity: glassOpacity, // Set the opacity to 0.8 (default is 1)
          side: THREE.DoubleSide, // Render the material on both sides of the mesh
          roughness: glassRoughness,
          name: object.material.name
        })
        object.material = glassMaterial
      }
    })
  }, [glassColor, glassOpacity])

  const loadItemSelect = () => {
    document.getElementById('blyd3d-display-item').addEventListener('click', function () {
      const itemId = document.getElementById('blyd3d-item-active').value

      removeAllObjects()
      drawFixedSlideWindowGrid(itemId)
      // dispatch({ type: 'SET_MAIN_URL', payload: item[itemId].path })
      // console.log(item[itemId].path)

      document.querySelector('.blyd3d-modal-panel-item').classList.add('blyd3d-hide')
    })

    document.getElementById('blyd3d-cancel-item').addEventListener('click', function () {
      document.querySelector('.blyd3d-modal-panel-item').classList.add('blyd3d-hide')
    })

    document.getElementById('blyd3d-step-done').addEventListener('click', function () {
      let sections = getSubdiviseSizes()

      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          const subAlupco = item[key]
          sections.forEach((section) => {
            if (subAlupco.name === section.alupco) {
              section.set('alupcoProperty', subAlupco)
            }
          })
        }
      }

      drawObjectGrid(sections)

      document.querySelector('.blyd3d-modal-panel-item').classList.add('blyd3d-hide')
      document.querySelector('.blyd3d-modal-panel').classList.add('blyd3d-hide')
    })
  }

  const render = () => {
    renderer.current.render(scene.current, camera.current)
    requestAnimationFrame(render)
  }

  // Fonction pour ajouter des lumières à la scène
  const addLight = () => {
    var light = new THREE.AmbientLight(0x404040 , 100)
    scene.current.add(light)

    var lumiereHaut = new THREE.DirectionalLight(0xffffff, 100)
    lumiereHaut.position.set(0, 1, 0)
    scene.current.add(lumiereHaut)

    var lumiereBas = new THREE.DirectionalLight(0xffffff, 100)
    lumiereBas.position.set(0, -1, 0)
    scene.current.add(lumiereBas)

    var lumiereGauche = new THREE.DirectionalLight(0xffffff, 100)
    lumiereGauche.position.set(-1, 0, 0)
    scene.current.add(lumiereGauche)

    var lumiereDroite = new THREE.DirectionalLight(0xffffff, 100)
    lumiereDroite.position.set(1, 0, 0)
    scene.current.add(lumiereDroite)

    var contreJour = new THREE.DirectionalLight(0xffffff, 100)
    contreJour.position.set(0, -1, -1)
    scene.current.add(contreJour)

    // Lumière de jour
    var jour = new THREE.DirectionalLight(0xffffff, 2)
    jour.position.set(0, -1, 1)
    scene.current.add(jour)

    render()
  }

  const addScene = () => {
    // Paramètres du cercle
    const radius = 14
    const segments = 68

    // const textureLoader = new THREE.TextureLoader();

    // var pathTexture = '../assets/scene/bois.jpg';

    // Création d'un cercle
    const geometry = new THREE.CircleGeometry(radius, segments)
    const material = new THREE.MeshPhongMaterial({
      // color: new THREE.Color("#10ff00"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
      // map: texture
    })

    // material.map.repeat.set(7, 1);
    // material.map.wrapS = THREE.RepeatWrapping;
    const plane = new THREE.Mesh(geometry, material)

    plane.castShadow = true // L'objet émet des ombres
    plane.receiveShadow = true // L'objet reçoit des ombres
    plane.rotation.x = -Math.PI / 2 // Mettre à plat
    plane.position.y = -1
    scene.current.add(plane)

    render()
  }

  const drawObjectGrid = async (sections, hideBorder = false) => {
    removeAllObjects()
    let filePaths = sections.map((section) => section.alupcoProperty.path)
    const sectionModels = await loadMultipleFile(filePaths)

    const grid = new THREE.Group()

    sections.forEach((section, index) => {
      const ext = getFileExtension(sectionModels[index].providePath)
      const obj = ext === 'glb' || ext === 'gltf' ? sectionModels[index].scene.clone() : sectionModels[index].clone()
      obj.providePath = sectionModels[index].providePath
      section.model = obj
    })

    let actualLeft = null,
      matrix = [],
      row = 0,
      column = 0

    sections
      .sort((a, b) => a.left - b.left)
      .forEach((section) => {
        if (actualLeft != null && section.left != actualLeft) {
          row = 0
          column += 1
        }

        if (!matrix[column]) matrix[column] = []

        matrix[column][row] = section

        actualLeft = section.left
        row += 1
      })

    for (let col = 0; col < matrix.length; col++) {
      const column = matrix[col].sort((a, b) => a.top - b.top)
      matrix[col] = column
    }

    const barSize = 0.032593

    for (let col = 0; col < matrix.length; col++) {
      const column = matrix[col]
      for (let row = 0; row < column.length; row++) {
        const section = column[row]
        var obj = section.model
        obj.position.x = 0
        obj.position.y = 0
        let foundBottom = false
        let foundRight = false

        if (hideBorder) {
          foundBottom = matrix.some((cols) =>
            cols.some((sub) => sub.top === section.top + section.height && sub.model.providePath !== alupco.fixed.path)
          )

          foundRight = matrix.some((cols) =>
            cols.some(
              (sub) => sub.left === section.left + section.width && sub.top === section.top && sub.model.providePath !== alupco.fixed.path
            )
          )
        } else {
          await hideModelBar(section.model, 'bottom')
          await hideModelBar(section.model, 'top')
          await hideModelBar(section.model, 'left')
          await hideModelBar(section.model, 'right')
        }

        if (foundBottom) {
          var hiddenBottomSize = await hideModelBar(section.model, 'bottom')
        }

        if (foundRight) {
          var hiddenRightSize = await hideModelBar(section.model, 'right')
        }

        obj.updateMatrixWorld(true)

        const provideHeight = parseFloat(section.provideHeight) / 1000
        const provideWidth = parseFloat(section.provideWidth) / 1000
        var newModel

        switch (obj.providePath) {
          case alupco.fixed.path:
            await hideModelPart(obj, '-DIVIDER-TSEC')
            newModel = await resizeFixedWindow(obj, provideHeight, provideWidth)
            break

          case alupco.sliding['2T']['2S'].path:
            newModel = await resize2T2SWindow(obj, provideHeight, provideWidth)
            break

          case alupco.sliding['2T']['3S'].path:
            newModel = await resizeWindow(obj, provideHeight, provideWidth, 3)
            break

          case alupco.sliding['2T']['4S'].path:
            newModel = await resizeWindow(obj, provideHeight, provideWidth, 4)
            break

          case alupco.sliding['3T']['3S'].path:
            newModel = await resizeWindow(obj, provideHeight, provideWidth, 3)
            break

          case alupco.sliding['3T']['6S'].path:
            newModel = await resizeWindow(obj, provideHeight, provideWidth, 6)
            break

          case alupco.sliding['4T']['4S'].path:
            newModel = await resizeWindow(obj, provideHeight, provideWidth, 4)
            break

          case alupco.sliding['4T']['8S'].path:
            newModel = await resizeWindow(obj, provideHeight, provideWidth, 8)
            break
          default:
            newModel = await resizeObject(obj, provideHeight, provideWidth)
            break
        }

        newModel.updateMatrixWorld(true)
        newModel.children.forEach((child) => child.updateMatrixWorld(true))
        let modelSize = getPanelPartSize(newModel)

        let left = 0,
          top = -modelSize.y / 2
        obj.col = col
        obj.row = row
        obj.moveToLeft = false
        obj.moveToTop = false
        obj.foundRight = foundRight
        obj.foundBottom = foundBottom

        obj.hidePart = {
          right: hiddenRightSize && obj.providePath !== alupco.fixed.path ? barSize : 0,
          bottom: hiddenBottomSize && obj.providePath !== alupco.fixed.path ? barSize : 0
        }

        obj.position.set(0, 0, 1)
        obj.modelSize = modelSize

        // console.log("col:", col, "row:", row, "path:", obj.providePath, "height", section.provideHeight, "width", section.provideWidth);
        matrix.some((cols) =>
          cols.some((sub) => {
            if (sub.top + sub.height === section.top && sub.model.modelSize) {
              let positionY = sub.model.position.y - sub.model.modelSize.y / 2

              top = positionY - modelSize.y / 2

              if (!foundBottom && obj.providePath !== alupco.fixed.path && sub.model.providePath !== alupco.fixed.path) {
                top = positionY - (modelSize.y / 2 - sub.model.hidePart.bottom)
              }

              return true
            }

            return false
          })
        )

        matrix.some((cols) =>
          cols.some((sub) => {
            if (sub.left + sub.width === section.left && sub.model.modelSize) {
              let realLeft = sub.model.position.x + sub.model.modelSize.x / 2
              left = realLeft + modelSize.x / 2
              if (!foundRight && obj.providePath !== alupco.fixed.path && sub.model.providePath !== alupco.fixed.path) {
                left -= sub.model.hidePart.right
              }

              return true
            } else if (sub.left === section.left && sub.model.modelSize) {
              let realLeft = sub.model.position.x
              left = realLeft + modelSize.x / 2
            }
            return false
          })
        )

        obj.position.set(left, top, 1)

        grid.add(obj)
      }
    }

    const size = new THREE.Box3().setFromObject(grid)
    grid.position.y -= size.max.y / 2
    grid.position.x += size.max.x / 2
    scene.current.add(grid)
    currentObj.current.push(grid)
    const center = new THREE.Vector3()
    size.getCenter(center)
    grid.position.copy(center).negate()
    adaptOnView(grid)

    selectObjectOnClick(grid)

    dispatch({ type: 'SET_MODEL_SIZE_WIDTH', payload: parseFloat(getObjSize(scene.current).width).toFixed(3) * 1000 })
    dispatch({ type: 'SET_MODEL_SIZE_HEIGHT', payload: parseFloat(getObjSize(scene.current).height).toFixed(3) * 1000 })
    render()
  }

  function getPanelPartSize(obj) {
    return new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3())
  }

  const buildPanel = async (obj, group = null) => {
    if (typeof obj.panelPath === 'undefined') return
    const panelSystem = obj.panelSystem
    const panelModelPath = obj.panelPath
    const loader = alupco.panel.type === 'glb' ? new GLTFLoader() : new FBXLoader()
    loader.setCrossOrigin('anonymous');

    return new Promise((resolve, reject) => {
      try {
        const loadModelCallback = (loadModel) => {
          let model = alupco.panel.type === 'glb' ? loadModel.scene.clone() : loadModel.clone()
          if (typeof savedModel.current[panelSystem] === 'undefined') savedModel.current[panelSystem] = loadModel

          obj.updateMatrixWorld(true)

          obj.traverse((child) => {
            child.updateMatrixWorld(true) // Assurez-vous que les matrices sont à jour
          })

          model.traverse((child) => {
            child.updateMatrixWorld(true) // Assurez-vous que les matrices sont à jour
          })

          const objSize = getPanelPartSize(obj)
          const modelSize = getPanelPartSize(model)

          // Get panel parts.
          const leftBar = model.children.filter((e) => e.name === 'left-bar')[0]
          const rightBar = model.children.filter((e) => e.name === 'right-bar')[0]
          const topBar = model.children.filter((e) => e.name === 'top-bar')[0]
          const bottomBar = model.children.filter((e) => e.name === 'bottom-bar')[0]
          const topLeftCorner = model.children.filter((e) => e.name === 'top-left-corner')[0]
          const topRightCorner = model.children.filter((e) => e.name === 'top-right-corner')[0]
          const bottomLeftCorner = model.children.filter((e) => e.name === 'bottom-right-corner')[0]
          const bottomRightCorner = model.children.filter((e) => e.name === 'bottom-left-corner')[0]

          // Get objects Sizes.
          const leftBarSize = getPanelPartSize(leftBar)
          // const rightBarSize = getPanelPartSize(rightBar);
          const topBarSize = getPanelPartSize(topBar)
          const topLeftCornerSize = getPanelPartSize(topLeftCorner)
          // const topRightCornerSize = getPanelPartSize(topRightCorner);
          // const bottomLeftCornerSize = getPanelPartSize(bottomLeftCorner);
          // const bottomRightCornerSize = getPanelPartSize(bottomRightCorner);

          const realWidth = modelSize.x
          const realHeight = modelSize.y

          const scaleX = objSize.x / realWidth
          const scaleY = objSize.y / realHeight

          const margeRatio = 2.46
          let marge = leftBarSize.x / margeRatio

          let newTopBarSizeWidth = topBarSize.x * scaleX - leftBarSize.x * 2
          let newLeftBarHeight = leftBarSize.y * scaleY - leftBarSize.x * 2

          if (panelSystem === '3T') {
            marge = marge * 1.5

            newTopBarSizeWidth = topBarSize.x * scaleX - (topLeftCornerSize.x + leftBarSize.x)
            newLeftBarHeight = leftBarSize.y * scaleY - (topLeftCornerSize.x + leftBarSize.x)
          }

          const horizontalScale = topBar.scale.x * ((newTopBarSizeWidth + leftBarSize.x) / topBarSize.x)
          const verticalScale = leftBar.scale.y * ((newLeftBarHeight + leftBarSize.x) / leftBarSize.y)

          topBar.scale.x = horizontalScale
          bottomBar.scale.x = horizontalScale
          // topBar.scale.y *= scaleY;
          // bottomBar.scale.y *= scaleY;

          topBar.updateMatrixWorld(true)
          bottomBar.updateMatrixWorld(true)

          leftBar.scale.y = verticalScale
          rightBar.scale.y = verticalScale
          // leftBar.scale.y *= scaleX;
          // rightBar.scale.y *= scaleX;

          topLeftCorner.position.y = newLeftBarHeight / 2 + marge * margeRatio
          topLeftCorner.position.x -= newTopBarSizeWidth / 2 + marge * margeRatio

          topRightCorner.position.y += newLeftBarHeight / 2 + marge * margeRatio
          topRightCorner.position.x += newTopBarSizeWidth / 2 + marge * margeRatio

          topBar.position.y = topLeftCorner.position.y + marge
          topBar.position.x = 0

          bottomBar.position.y -= topLeftCorner.position.y + marge
          bottomBar.position.x = 0

          leftBar.position.x += topLeftCorner.position.x - marge
          rightBar.position.x += topRightCorner.position.x + marge

          leftBar.position.y = 0
          rightBar.position.y = 0

          bottomLeftCorner.position.y = -(newLeftBarHeight / 2 + marge * margeRatio)
          bottomLeftCorner.position.x += newTopBarSizeWidth / 2 + marge * margeRatio

          bottomRightCorner.position.y -= newLeftBarHeight / 2 + marge * margeRatio
          bottomRightCorner.position.x -= newTopBarSizeWidth / 2 + marge * margeRatio

          // model.position.copy(obj.position);
          model.updateMatrixWorld(true)

          model.position.copy(obj.position)
          if (group == null) {
            scene.current.add(model)
            currentObj.current.push(model)
          }

          resolve(model)
        }

        if (typeof savedModel.current[panelSystem] === 'undefined') {
          const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
          const targetUrl = panelModelPath;
          const finalUrl = proxyUrl + targetUrl;
          loader.load(finalUrl, loadModelCallback, undefined, (error) => {
            console.error('Erreur lors du chargement du modèle :', error)
            reject(error)
          })
        } else {
          loadModelCallback(savedModel.current[panelSystem])
        }
      } catch (error) {
        console.error('Erreur lors de la construction du panneau :', error)
        reject(error)
      }
    })
  }

  /**
   * Builds a grid of fixed columns based on the number of columns and lines and the size of each column.
   * Chan
   * @param {int|float} column This is the number of columns the grid will have.
   * @param {int|float} row This is the number of rows the grid will have.
   * @param {int|float} width This is the maximum width of the grid.
   * @param {object} height This is the maximum height of the grid.
   * @param {object} sizes These are the dimensions specific to each cell.
   */
  const drawFixedWindowGrid = (columns = 2, rows = 1, width = null, height = null, sizes = { width: [], height: [] }) => {
    const fixedModelPath = alupco.fixed.path
    const loader = alupco.fixed.type === 'glb' ? new GLTFLoader() : new FBXLoader() // Assurez-vous d'utiliser le bon préfixe pour FBXLoader
    loader.setCrossOrigin('anonymous');
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = fixedModelPath;
    const finalUrl = proxyUrl + targetUrl;
    loader.load(finalUrl, function (loadmodel) {
      const model = alupco.fixed.type === 'glb' ? loadmodel.scene.clone() : loadmodel.clone()

      const defaultSize = getObjSize(model) // Récuprer les dimensions par défaut de l'objet fbx chargé

      if (width != null) {
        model.scale.x = width / Math.abs(defaultSize.width)
      }

      if (height != null) {
        model.scale.y = height / Math.abs(defaultSize.height)
        model.scale.z = model.scale.y
      }

      var childMaterial

      model.children.forEach((e) => {
        if (e.name == 'Layer11366') {
          childMaterial = e.material.clone()
        }
      })

      const boiteEnglobante = new THREE.Box3().setFromObject(model) // Définition de boiteEnglobante

      const barMaterial = childMaterial

      const verticalWidth = boiteEnglobante.max.x - boiteEnglobante.min.x - boiteEnglobante.max.z / 2

      const barSize = (verticalWidth * 5) / 100
      const boxHeight = boiteEnglobante.max.y - boiteEnglobante.min.y - barSize / 3

      const horizontalBarBox = new RoundedBoxGeometry(barSize, boxHeight, barSize / 2, 6, 0.2)

      const verticalBarBox = new RoundedBoxGeometry(verticalWidth, barSize, barSize / 2, 6, 0.2)

      const verticalBar = new THREE.Mesh(horizontalBarBox, barMaterial)
      const horizontalBar = new THREE.Mesh(verticalBarBox, barMaterial)
      verticalBar.position.y = boxHeight / 2 + barSize
      verticalBar.position.x -= verticalWidth / 2 + barSize / 2

      const grid = new THREE.Group()

      var rowHeight = boxHeight / rows

      var colWidth = verticalWidth / columns

      const colObject = []

      for (let col = 0; col < columns - 1; col++) {
        const verticalGridClone = verticalBar.clone()

        const xWidth = sizes.width.length > 0 ? verticalWidth / (parseFloat(width) / parseFloat(sizes.width[col])) : colWidth

        const startX = colObject[col - 1] ? colObject[col - 1].position.x : verticalBar.position.x - barSize - barSize / 2

        verticalGridClone.position.x = barSize + startX + xWidth

        colObject.push(verticalGridClone)

        grid.add(verticalGridClone)
      }

      const rowObject = []

      for (let row = 0; row < rows - 1; row++) {
        const horizontalGridClone = horizontalBar.clone()

        const yHeight = sizes.height.length > 0 ? boxHeight / (parseFloat(height) / parseFloat(sizes.height[row])) : rowHeight

        const startY = rowObject[row - 1] ? rowObject[row - 1].position.y : horizontalBar.position.y - barSize

        horizontalGridClone.position.y = barSize + startY + yHeight

        rowObject.push(horizontalGridClone)

        grid.add(horizontalGridClone)
      }

      // Ajouter le groupe de fenêtres à la scène

      model.rotation.y = Math.PI

      const fullModel = new THREE.Group()

      if (width > height) {
        fullModel.rotation.x = Math.PI
      }

      grid.position.copy(model.position)

      grid.position.x += barSize / 2
      grid.position.y -= barSize / 5
      grid.position.z -= barSize

      fullModel.add(model, grid)

      // Calculer le centre de l'objet model
      const center = new THREE.Vector3()
      boiteEnglobante.getCenter(center)

      // Déplacer le groupe fullModel pour que le centre de l'objet model soit à l'origine
      fullModel.position.copy(center).negate()

      scene.current.add(fullModel)

      adaptOnView(fullModel)

      childMaterial.color = new THREE.Color('#666')

      // const gridx = drawSimpleRectangularGrid(fullModel, childMaterial);
      // scene.current.add(gridx);

      currentObj.current.push(fullModel)
      // currentObj.current.push(gridx);

      render()

      return selectObjectOnClick(fullModel)
    })
  }

  function onWindowResize() {
    camera.current.aspect = window.innerWidth / window.innerHeight
    camera.current.updateProjectionMatrix()

    renderer.current.setSize(window.innerWidth, window.innerHeight)
  }

  const selectObjectOnClick = function (model) {
    // Tableau pour stocker les informations sur le dernier élément cliqué
    let lastClicked = null

    function mapChild(obj) {
      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          var caption = document.getElementById('caption')

          child.userData.onClick = function () {
            // Restaurer la texture de l'élément précédemment cliqué
            if (lastClicked) {
              scene.current.traverse((object) => {
                if (lastClicked.material.name.includes('HANDL')) {
                  if (object.isMesh && object.material.name.includes('HANDL')) {
                    object.material = lastClicked.material
                  }
                } else if (lastClicked.material.name.includes('GLZ')) {
                  if (object.isMesh && object.material.name.includes('GLZ')) {
                    object.material = lastClicked.material
                  }
                }
              })
              lastClicked.material = lastClicked.savedMaterial
            }

            // Stocker les informations sur l'élément actuellement cliqué
            lastClicked = child
            lastClicked.savedMaterial = child.material.clone()

            const worldPosition = new THREE.Vector3()
            lastClicked.getWorldPosition(worldPosition)
            // console.log('World Position of Object', worldPosition);

            // console.log(child.name)
            // caption.id = 'myNewDiv';
            // caption.className = 'caption';
            // console.log(child)
            caption.textContent = child.name
            selected.current = child.name
            caption.classList.remove('hidden')
            // document.getElementById('mainView').appendChild(caption);

            const vector = new THREE.Vector3()
            vector.setFromMatrixPosition(lastClicked.matrixWorld)
            vector.project(camera.current)

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth - 100
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight

            caption.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`

            // let spritey = makeTextSprite( " Hello ",
            //   { fontsize: 14, textColor: {r:255, g:255, b:255, a:0.8}} );
            // spritey.position.set(worldPosition.x,worldPosition.y,worldPosition.z);
            // console.log(spritey)
            // scene.current.add(spritey);

            // scene.current.traverse((object) => {
            //   if(lastClicked.material.name.includes("HANDL")){
            //     if (object.isMesh && object.material.name.includes("HANDL")) {
            //       object.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0cc9ff') })
            //     }
            //   } else if(lastClicked.material.name.includes("GLZ")){
            //     if (object.isMesh && object.material.name.includes("GLZ")) {
            //       object.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0cc9ff') })
            //     }
            //   }
            //   // if (object.isMesh && object.material.name.includes(lastClicked.material.name)) {
            //   //   // object.scale.set(1.1, 1.1, 1.1)
            //   //   // console.log(object)
            //   //   object.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0cc9ff') })
            //   // }
            // })

            // console.log(child.name)
            // Appliquer la nouvelle texture à l'élément cliqué
            // child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0cc9ff') })
          }
          child.userData.raycasterEnabled = true
        }
      })
    }

    // Fonction récursive pour parcourir tous les enfants, y compris les groupes imbriqués
    function traverseRecursive(obj) {
      mapChild(obj)
      obj.children.forEach((child) => {
        traverseRecursive(child)
      })
    }

    traverseRecursive(model)

    const handleClick = (event) => {
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      mouse.x = (event.offsetX / canvasSelector.current.offsetWidth) * 2 - 1
      mouse.y = -(event.offsetY / canvasSelector.current.offsetHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera.current)

      const intersects = raycaster.intersectObjects(model.children, true)

      if (intersects.length > 0) {
        intersects[0].object.userData.onClick()
      } else {
        var caption = document.getElementById('caption')
        // caption.id = 'myNewDiv';
        // caption.className = 'caption';
        caption.classList.add('hidden')
        selected.current = null
        // document.getElementById('mainView').appendChild(caption);
      }
    }

    const onMouseClick = (event) => {
      var popup = document.getElementById('popup')

      const canvasRect = canvasSelector.current.getBoundingClientRect()

      const mousePosition = {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top
      }

      if (selected.current) {
        popup.classList.remove('hidden')
        popup.style.transform = `translate(-50%, -50%) translate(${mousePosition.x}px,${mousePosition.y}px)`
      } else {
        popup.classList.add('hidden')
      }
    }

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('click', onMouseClick)
    canvasSelector.current.addEventListener('pointermove', handleClick)

    return () => {
      canvasSelector.current.removeEventListener('pointermove', handleClick)
      window.removeEventListener('click', onMouseClick)
      window.removeEventListener('resize', onWindowResize)
    }
  }

  const drawFixedSlideWindowGrid = (modelPath) => {
    const fixedModelPath = modelPath
    // const panelModelPath = selectedWindow.panel
    // const panelSystem = selectedWindow.panelSystem

    const loader = new GLTFLoader()
    loader.setCrossOrigin('anonymous');
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = modelPath;
    const finalUrl = proxyUrl + targetUrl;
    loader.load(finalUrl, function (loadModel) {
      let model = loadModel.scene
      if (finalUrl === alupco.fixed.path) hideModelPart(model, '-DIVIDER-TSEC')
      const center = new THREE.Vector3()
      const objBoundingBox = new THREE.Box3().setFromObject(model)
      center.add(objBoundingBox.getCenter(new THREE.Vector3()))
      model.position.y = -center.y

      // model.panelPath = panelModelPath
      // model.panelSystem = panelSystem
      buildPanel(model)

      scene.current.add(model)
      // let labelHelper = new LabelHelper(model, "Width", new THREE.Vector3(0, 0, 0));
      // scene.current.add(labelHelper)
      currentObj.current.push(model)

      dispatch({ type: 'SET_MODEL_SIZE_WIDTH', payload: parseFloat(getObjSize(scene.current).width).toFixed(3) * 1000 })
      dispatch({ type: 'SET_MODEL_SIZE_HEIGHT', payload: parseFloat(getObjSize(scene.current).height).toFixed(3) * 1000 })

      const size = objBoundingBox
      model.position.y -= size.max.y / 2
      model.position.x += size.max.x / 2
      size.getCenter(center)
      model.position.copy(center).negate()

      scene.current.traverse((object) => {
        if (object.isMesh && object.name.includes('BRDR')) {
          object.visible = false
        }
      })

      // calculateAndDrawSize(model)

      adaptOnView(model)
      render()

      selectObjectOnClick(model)
    })
  }

  const adaptOnView = (object) => {
    const objBoundingBox = new THREE.Box3().setFromObject(object)
    camera.current.position.z = Math.max(objBoundingBox.max.y - objBoundingBox.min.y, objBoundingBox.max.x - objBoundingBox.min.x) + 1
  }

  function getFileExtension(url) {
    return url.match(/\.([^.]+)$/)[1]
  }

  // Fonction pour charger un fichier FBX
  const loadFile = (filePath) => {
    const ext = getFileExtension(filePath)
    return new Promise((resolve, reject) => {
      const loader = ext === 'glb' || ext === 'gltf' ? new GLTFLoader() : new FBXLoader()
      loader.setCrossOrigin('anonymous');
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = filePath;
      const finalUrl = proxyUrl + targetUrl;
      loader.load(finalUrl, resolve, undefined, reject)
    })
  }

  // Fonction pour charger plusieurs fichiers FBX
  const loadMultipleFile = async (filePaths) => {
    try {
      const loadedModels = []
      for (const filePath of filePaths) {
        if (typeof savedModel.current[filePath] === 'undefined') {
          const model = await loadFile(filePath)
          model.providePath = filePath
          loadedModels.push(model)
          savedModel.current[filePath] = model
        } else {
          loadedModels.push(savedModel.current[filePath])
        }
      }
      return loadedModels
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers FBX :', error)
      throw error // Rejeter l'erreur pour la gérer à un niveau supérieur si nécessaire
    }
  }

  const getObjSize = (objet) => {
    objet.children.forEach((child) => {
      child.updateMatrixWorld(true)
    })

    objet.updateMatrixWorld(true)
    const size = getPanelPartSize(objet)
    return {
      width: size.x,
      height: size.y
    }
  }

  const removeAllObjects = () => {
    currentObj.current.forEach((object) => {
      scene.current.remove(object)
    })

    currentObj.current = []

    render()
  }

  function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {}
    var fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Courier New'
    var fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontsize'] : 10
    var borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters['borderThickness'] : 4
    var borderColor = parameters.hasOwnProperty('borderColor') ? parameters['borderColor'] : { r: 50, g: 50, b: 50, a: 1.0 }
    var backgroundColor = parameters.hasOwnProperty('backgroundColor') ? parameters['backgroundColor'] : { r: 0, g: 0, b: 255, a: 1.0 }
    var textColor = parameters.hasOwnProperty('textColor') ? parameters['textColor'] : { r: 0, g: 0, b: 0, a: 1.0 }

    var canvas = document.createElement('canvas')
    var context = canvas.getContext('2d')
    context.font = 'Bold ' + fontsize + 'px ' + fontface
    var metrics = context.measureText(message)
    var textWidth = metrics.width

    context.fillStyle = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')'
    context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ',' + borderColor.b + ',' + borderColor.a + ')'
    context.fillStyle = 'rgba(' + textColor.r + ', ' + textColor.g + ', ' + textColor.b + ', 1.0)'
    context.fillText(message, borderThickness, fontsize + borderThickness)

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    var sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(0.2 * fontsize, 0.2 * fontsize, 0.2 * fontsize)
    return sprite
  }

  function UnwrapUVs(geometry) {
    let g = geometry
    let triCount = (g.index ? g.index.count : g.attributes.position.count) / 3
    // console.log("autogenerating UV map... ",triCount)

    let box = new THREE.Box3()
    let v0 = new THREE.Vector3()
    let v1 = new THREE.Vector3()
    let v2 = new THREE.Vector3()
    let pa = g.attributes.position.array
    let getTriangle = (i) => {
      let idx = g.index.array
      if (idx) {
        let vi = i * 3
        let ia = idx[vi] * 3
        let ib = idx[vi + 1] * 3
        let ic = idx[vi + 2] * 3
        v0.set(pa[ia], pa[ia + 1], pa[ia + 2])
        v1.set(pa[ib], pa[ib + 1], pa[ib + 2])
        v2.set(pa[ic], pa[ic + 1], pa[ic + 2])
      }
    }
    let boxUnwrap = (v0, v1, v2) => {
      box.setEmpty()
      box.expandByPoint(v0)
      box.expandByPoint(v1)
      box.expandByPoint(v2)
    }
    let uvs = new Float32Array((pa.length * 2) / 3)

    box.makeEmpty()
    for (let i = 0; i < pa.length; i += 3) {
      v0.set(pa[i], pa[i + 1], pa[i + 2])
      box.expandByPoint(v0)
    }
    let sz = box.getSize(v0)
    let bmin = box.min.clone()
    let { max } = Math
    let imaxax = 1 / max(sz.x, max(sz.y, sz.z))
    for (let i = 0, w = 0; i < triCount; i++, w += 6) {
      getTriangle(i)
      v0.sub(bmin).multiplyScalar(imaxax)
      v1.sub(bmin).multiplyScalar(imaxax)
      v2.sub(bmin).multiplyScalar(imaxax)
      uvs[w] = v0.x
      uvs[w + 1] = v0.y
      uvs[w + 2] = v1.x
      uvs[w + 3] = v1.y
      uvs[w + 4] = v2.x
      uvs[w + 5] = v2.y
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    g.attributes.uv.needsUpdate = true
  }

  function calculateAndDrawSize(object) {
    // Box helper to get the size
    const box = new THREE.Box3().setFromObject(object)
    // Get dimensions
    const size = new THREE.Vector3()
    box.getSize(size)
    // Create a line geometry for the width
    const widthLineGeometry = new THREE.BufferGeometry()
    widthLineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [
          object.position.x - object.geometry.boundingBox.max.x / 2,
          object.position.y,
          object.position.z,
          object.position.x + object.geometry.boundingBox.max.x / 2,
          object.position.y,
          object.position.z
        ],
        3
      )
    )

    // Create a line geometry for the height
    const heightLineGeometry = new THREE.BufferGeometry()
    heightLineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [
          object.position.x,
          object.position.y - object.geometry.boundingBox.max.y / 2,
          object.position.z,
          object.position.x,
          object.position.y + object.geometry.boundingBox.max.y / 2,
          object.position.z
        ],
        100
      )
    )
    // Create a line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })

    // Create the lines
    const widthLine = new THREE.Line(widthLineGeometry, lineMaterial)
    const heightLine = new THREE.Line(heightLineGeometry, lineMaterial)

    // Add the lines to the scene
    scene.current.add(widthLine)
    scene.current.add(heightLine)
  }

  // function projectToScreen(vector) {
  //   const widthHalf = 0.5 * canvasSelector.current.offsetWidth
  //   const heightHalf = 0.5 * canvasSelector.current.offsetHeight
  //   // console.log(widthHalf, heightHalf)
  //   const projected = vector.clone().project(camera.current)
  //   return {
  //     x: projected.x * widthHalf + widthHalf,
  //     y: -(projected.y * heightHalf) + heightHalf
  //   }
  // }

  // function extractInnerData(obj) {
  //   for (const key in obj) {
  //     if (typeof obj[key] === 'object') {
  //       return obj[key]
  //     }
  //   }
  //   return null // Return null if no nested object found
  // }
  function handleClick() {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 5 })
  }
  return (
    <div id="mainView">
      <div id="popup" className="bg-white-600 flex-col w-52 absolute hidden border-2">
        <div className="ml-1 mr-1 p-3 border-[2px] cursor-pointer hover:bg-gray-300 bg-white" onClick={handleClick}>
          Opening Types
        </div>
        <div className="ml-1 mr-1 p-3 border-[2px] cursor-pointer hover:bg-gray-300 bg-white">Glazing</div>
      </div>
      <div id="caption" className="caption"></div>
      <div ref={canvasSelector} />
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default BLYD3D
