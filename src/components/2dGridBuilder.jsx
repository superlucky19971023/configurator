import { useRef, useEffect } from 'react'
import { fabric } from 'fabric'
import { alupco } from './alupcoWindow.json'
import { getParentByKey } from './utils'

var gridData = { current: [] },
  drawGridStep = 0,
  isDrawing = false,
  startPoint,
  drawingObject,
  objTop = 0,
  objLeft = 0,
  globalObjHeight = 0,
  globalObjWidth = 0,
  splitLine,
  lockDrawing = false,
  lockSpliting = false,
  canvas,
  gridSpacing = 5,
  leftInputField = [],
  bottomInputField = [],
  topRuler,
  leftRuler,
  counter = 0 // Un compteur pour ajouter un identifiant unique

const saveGridData = (data) => {
  gridData.current = data
}

function redrawRulers() {
  drawRulers(canvas, topRuler, leftRuler)
}

function drawRulers(contentCanvas, horizontalRulerCanvas, verticalRulerCanvas) {
  let vpt = contentCanvas.viewportTransform
  drawRuler(vpt, verticalRulerCanvas, true)
  drawRuler(vpt, horizontalRulerCanvas, false)
}

function drawRuler(vpt, ruler, isVertical) {
  ruler.renderOnAddRemove = false

  ruler.clear()
  ruler.setBackgroundColor('white')
  console.log(ruler)
  let blockValueInvertMatrix = fabric.util.invertTransform(vpt)

  let offset = isVertical ? 1 : 0
  let rulerThickness = isVertical ? ruler.width : ruler.height
  let rulerSize = isVertical ? ruler.height : ruler.width
  let pan = isVertical ? vpt[5] : vpt[4]
  let zoomLevel = vpt[3]

  let detailFactor = zoomLevel >= 1 ? zoomLevel / Math.floor(zoomLevel) : zoomLevel * Math.floor(1 / zoomLevel)
  let blockRange = 50
  let blockSize = blockRange * detailFactor
  let blockOffset = pan % blockSize

  let tickLength = rulerThickness / 2
  let position = [0, 0, 0, 0]
  let ticksPerBlock = 10
  for (let i = blockOffset - blockSize; i <= rulerSize; i += blockSize) {
    for (let tickIndex = 0; tickIndex < ticksPerBlock; ++tickIndex) {
      let tickPosition = i + (tickIndex * blockSize) / ticksPerBlock
      let tickLengthFactor = tickIndex == 0 ? 1.5 : tickIndex == ticksPerBlock / 2 ? 1.25 : 1

      position[0 + offset] = Math.round(tickPosition)
      position[1 - offset] = rulerThickness - tickLength * tickLengthFactor
      position[2 + offset] = Math.round(tickPosition)
      position[3 - offset] = rulerThickness

      let tick = new fabric.Line(position, {
        stroke: 'black',
        strokeWidth: 1,
        objectCaching: true // makes text clear, and the whole behavior more fluent
      })
      ruler.add(tick)
    }

    position[0 + offset] = Math.round(i) // text position on axis
    position[1 - offset] = 0 //text offset

    let blockPoint = fabric.util.transformPoint(
      {
        x: i,
        y: i
      },
      blockValueInvertMatrix
    )

    let blockText = isVertical ? blockPoint.y : blockPoint.x

    var blockLabel = new fabric.Text(Math.round(blockText).toString(), {
      left: position[0],
      top: position[1],
      fontSize: 10,
      objectCaching: false // makes text clear, and the whole behavior more fluent
    })
    ruler.add(blockLabel)
  }
  ruler.requestRenderAll();
}

// eslint-disable-next-line react-refresh/only-export-components
export const getCanvas = () => {
  return canvas
}

// eslint-disable-next-line react-refresh/only-export-components
export const getModelSize = () => {
  return {
    height: globalObjHeight,
    width: globalObjWidth
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const generateUniqueId = () => {
  counter++ // Incrémenter le compteur pour chaque clé générée

  const randomPart = Math.random().toString(36).substring(2, 8) // Générer une petite chaîne aléatoire
  const timestampPart = Date.now().toString(36) // Horodatage en base 36

  return `key-${randomPart}-${timestampPart}-${counter}` // Combiner les parties
}

// eslint-disable-next-line react-refresh/only-export-components
export const getGridData = () => {
  return gridData.current
}

// eslint-disable-next-line react-refresh/only-export-components
export const loadDefaultEvent = () => {
  if (document.querySelectorAll('.blyd3d-second-step label') != null)
    document.querySelectorAll('.blyd3d-second-step label').forEach((e) => {
      e.addEventListener('click', function () {
        document.getElementById(e.getAttribute('for')).click()
      })
    })

  if (document.getElementById('blyd3d-cancel-item-type') != null)
    document.getElementById('blyd3d-cancel-item-type').addEventListener('click', function () {
      document.querySelector('.blyd3d-modal-panel-item-type').classList.add('blyd3d-hide')
    })

  document.getElementById('blyd3d-step-prev').addEventListener('click', function (e) {
    document.querySelector('.blyd3d-modal-panel').classList.add('blyd3d-hide')
    document.querySelector('.blyd3d-second-step').classList.add('blyd3d-hide')
    document.querySelector('.blyd3d-first-step').classList.remove('blyd3d-hide')
    document.querySelector('#blyd3d-step-next').classList.remove('blyd3d-hide')
    document.querySelector('#blyd3d-step-done').classList.add('blyd3d-hide')
    drawGridStep = 0

    if (document.querySelectorAll('.blyd3d-grid-input-field').length > 0)
      document.querySelectorAll('.blyd3d-grid-input-field').forEach((e) => {
        try {
          e.remove()
        } catch (err) {
          console.error('Error removing grid type field: ', err)
        }
      })

    if (document.querySelectorAll('.blyd3d-grid-type-field').length > 0)
      document.querySelectorAll('.blyd3d-grid-type-field').forEach((e) => {
        try {
          e.remove()
        } catch (err) {
          console.error('Error removing grid type field: ', err)
        }
      })

    canvas.getObjects().find((obj) => {
      if (obj.gridId === 'rectangularForm') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.type === 'line') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.type === 'rect') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.type === 'text') canvas.remove(obj)
    })

    lockDrawing = false
    lockSpliting = false

    canvas.getObjects().forEach((e) => {
      if (!e.survol) e.set({ visible: true })
    })
  })

  document.getElementById('blyd3d-step-reset').addEventListener('click', function () {
    // document.querySelector(".blyd3d-modal-panel").classList.add("blyd3d-hide");
    document.querySelector('.blyd3d-second-step').classList.add('blyd3d-hide')
    document.querySelector('.blyd3d-first-step').classList.remove('blyd3d-hide')
    document.querySelector('#blyd3d-step-next').classList.remove('blyd3d-hide')
    document.querySelector('#blyd3d-step-done').classList.add('blyd3d-hide')
    document.querySelectorAll('.blyd3d-stack-action').forEach((e) => {
      e.classList.remove('blyd3d-hide')
    })

    drawGridStep = 0
    leftInputField = []
    bottomInputField = []

    if (document.querySelectorAll('.blyd3d-grid-input-field').length > 0)
      document.querySelectorAll('.blyd3d-grid-input-field').forEach((e) => {
        e.remove()
      })

    if (document.querySelectorAll('.blyd3d-grid-type-field').length > 0)
      document.querySelectorAll('.blyd3d-grid-type-field').forEach((e) => {
        e.remove()
      })

    if (document.querySelectorAll('.blyd3d-alupco-2d-svg').length > 0)
      document.querySelectorAll('.blyd3d-alupco-2d-svg').forEach((e) => {
        e.remove()
      })

    canvas.getObjects().find((obj) => {
      if (obj.gridId === 'rectangularForm') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.grid === 'line') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.grid === 'bars') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.type === 'line') canvas.remove(obj)
    })
    canvas.getObjects().find((obj) => {
      if (obj.section === 'grid') canvas.remove(obj)
    })

    lockDrawing = false
    lockSpliting = false

    canvas.getObjects().forEach((e) => {
      if (!e.survol) e.set({ visible: true })
    })
  })
}

// eslint-disable-next-line react-refresh/only-export-components
export const drawGrid = () => {
  // Taille de la grille
  var gridSize = Math.max(canvas.width, canvas.height) / 50
  var gridSpacing = canvas.width / gridSize

  // Création de la grille
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      // Création d'un cercle à chaque intersection de la grille
      var circle = new fabric.Circle({
        radius: 2,
        fill: '#505152',
        left: i * gridSpacing,
        top: j * gridSpacing,
        selectable: false,
        hasControls: false,
        hasBorders: false,
        opacity: 0.2
      })
      canvas.add(circle)
    }
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const loadCanvasEvent = () => {
  // Gestionnaire d'événement pour le début du dessin
  canvas.on('mouse:down', function (event) {
    isDrawing = true
    saveState()
    var spliter = document.querySelector('[name="blyd3d-spliter"]:checked').value
    if (document.querySelector('.blyd3d-first-step').classList.contains('blyd3d-hide') && !lockSpliting) {
      // Récupérer les coordonnées du point cliqué
      var pointer = canvas.getPointer(event.e)
      var x = Math.floor(pointer.x / gridSpacing) * gridSpacing
      var y = Math.floor(pointer.y / gridSpacing) * gridSpacing

      const clickedObjects = canvas.getObjects().filter((obj) => obj.containsPoint({ x, y }) && obj.type === 'rect')
      const selectedObject = clickedObjects[0]

      if (spliter === 'vertical' && typeof selectedObject !== 'undefined') {
        // Créer une ligne verticale pour subdiviser l'objet
        const subSectionA = new fabric.Rect({
          left: selectedObject.left,
          top: selectedObject.top,
          width: x - selectedObject.left,
          height: selectedObject.height,
          stroke: 'blue',
          strokeWidth: 2,
          fill: 'transparent',
          section: 'grid',
          id: generateUniqueId(),
          selectable: false
        })

        const subSectionB = new fabric.Rect({
          left: x,
          top: selectedObject.top,
          width: selectedObject.width - (x - selectedObject.left),
          height: selectedObject.height,
          stroke: 'blue',
          strokeWidth: 2,
          section: 'grid',
          fill: 'transparent',
          id: generateUniqueId(),
          selectable: false
        })

        canvas.add(subSectionA, subSectionB)
        canvas.remove(selectedObject)
        canvas.renderAll()
      } else if (spliter === 'horizontal' && typeof selectedObject !== 'undefined') {
        // Créer une ligne horizontale pour subdiviser l'objet
        const subSectionA = new fabric.Rect({
          left: selectedObject.left,
          top: selectedObject.top,
          width: selectedObject.width,
          height: y - selectedObject.top,
          fill: 'transparent',
          stroke: 'blue',
          section: 'grid',
          strokeWidth: 2,
          id: generateUniqueId(),
          selectable: false
        })

        const subSectionB = new fabric.Rect({
          left: selectedObject.left,
          top: y,
          width: selectedObject.width,
          height: selectedObject.height - (y - selectedObject.top),
          fill: 'transparent',
          stroke: 'blue',
          section: 'grid',
          strokeWidth: 2,
          id: generateUniqueId(),
          selectable: false
        })

        canvas.add(subSectionA, subSectionB)
        canvas.remove(selectedObject)
        canvas.renderAll()
      }
      return
    }

    if (lockDrawing) return

    var pointer = canvas.getPointer(event.e)
    startPoint = { x: Math.floor(pointer.x / gridSpacing) * gridSpacing, y: Math.floor(pointer.y / gridSpacing) * gridSpacing }

    // Désactive la sélection des objets pendant le dessin
    canvas.selection = false

    // Supprimer l'objet de dessin précédent
    if (typeof drawingObject === 'object') canvas.remove(drawingObject)

    // Dessiner un cercle au point de départ pour indiquer le début du dessin
    drawingObject = new fabric.Circle({
      radius: 5,
      fill: 'blue',
      left: startPoint.x - 5,
      top: startPoint.y - 5,
      selectable: false,
      hasControls: false,
      hasBorders: false
    })
    canvas.add(drawingObject)
    canvas.renderAll()

    document.getElementById('blyd3d-step-next').removeAttribute('disabled')
  })

  canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY
    var zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 20) zoom = 20
    if (zoom < 0.01) zoom = 0.01
    canvas.zoomToPoint(
      {
        x: opt.e.offsetX,
        y: opt.e.offsetY
      },
      zoom
    )
    opt.e.preventDefault()
    opt.e.stopPropagation()

    redrawRulers()
  })

  let horizontalSurvol = new fabric.Rect({
    width: 100,
    height: 1,
    fill: 'red',
    visible: false,
    typeSurvol: 'h',
    survol: true
  })

  let verticalSurvol = new fabric.Rect({
    width: 1,
    height: 100,
    fill: 'red',
    visible: false,
    typeSurvol: 'v',
    survol: true
  })

  canvas.add(verticalSurvol, horizontalSurvol)

  // Gestionnaire d'événement pour le dessin continu
  canvas.on('mouse:move', function (event) {
    var pointer = canvas.getPointer(event.e)
    var currentPoint = { x: Math.round(pointer.x / gridSpacing) * gridSpacing, y: Math.round(pointer.y / gridSpacing) * gridSpacing }

    var spliter = document.querySelector('[name="blyd3d-spliter"]:checked').value

    if (document.querySelector('.blyd3d-first-step').classList.contains('blyd3d-hide') && !lockSpliting) {
      var x = Math.floor(pointer.x / gridSpacing) * gridSpacing
      var y = Math.floor(pointer.y / gridSpacing) * gridSpacing
      const clickedObjects = canvas.getObjects().filter((obj) => obj.containsPoint({ x, y }) && obj.type === 'rect')
      const selectedObject = clickedObjects[0]

      let horizontalSurvol = canvas.getObjects().find((obj) => obj.typeSurvol === 'h')
      let verticalSurvol = canvas.getObjects().find((obj) => obj.typeSurvol === 'v')

      if (spliter == 'horizontal' && typeof selectedObject === 'object') {
        horizontalSurvol.set({ width: selectedObject.width, left: selectedObject.left, top: currentPoint.y, visible: true, fill: 'red' })
        verticalSurvol.set({ visible: false })
      } else if (spliter == 'vertical' && typeof selectedObject === 'object') {
        verticalSurvol.set({ height: selectedObject.height, left: currentPoint.x, top: selectedObject.top, visible: true })
        horizontalSurvol.set({ visible: false })
      } else {
        horizontalSurvol.set({ visible: false })
        verticalSurvol.set({ visible: false })
      }

      canvas.requestRenderAll()
    } else {
      horizontalSurvol.set({ visible: false })
      verticalSurvol.set({ visible: false })
    }

    if (lockDrawing) return

    if (!isDrawing) return

    // Supprimer l'objet de dessin précédent
    canvas.remove(drawingObject)

    // Dessiner un rectangle ou un cercle en fonction du type de dessin sélectionné
    if (document.getElementById('blyd3d-draw-rect').checked) {
      drawingObject = new fabric.Rect({
        left: Math.min(startPoint.x, currentPoint.x),
        top: Math.min(startPoint.y, currentPoint.y),
        width: Math.abs(currentPoint.x - startPoint.x),
        height: Math.abs(currentPoint.y - startPoint.y),
        fill: 'transparent',
        stroke: 'blue',
        strokeWidth: 4,
        selectable: false,
        hasControls: false,
        hasBorders: false,
        gridId: 'rectangularForm',
        id: generateUniqueId(),
        section: 'grid'
      })
    }

    // Ajouter l'objet de dessin actuel sur le canvas
    canvas.add(drawingObject)
  })

  // Gestionnaire d'événement pour la fin du dessin
  canvas.on('mouse:up', function () {
    isDrawing = false

    // Réactiver la sélection des objets après avoir terminé le dessin
    canvas.selection = true
    canvas.renderAll()
  })
}

// Get subdivized zone.
// eslint-disable-next-line react-refresh/only-export-components
export const getSubdiviseSizes = () => {
  return canvas.getObjects('rect').filter((obj) => obj.section === 'grid')
}

function createVerticalLine(height, top, left) {
  const line = new fabric.Rect({
    left: left + 20,
    top: top + 5,
    width: 2,
    height: height - 10,
    fill: 'red',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    grid: 'line'
  })

  const lineTop = new fabric.Rect({
    left: line.left,
    top: line.top,
    width: 10,
    height: 2,
    fill: 'red',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    grid: 'line'
  })

  const lineBottom = new fabric.Rect({
    left: line.left,
    top: line.top + line.height,
    width: 10,
    height: 2,
    fill: 'red',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    grid: 'line'
  })

  canvas.add(line, lineTop, lineBottom)
}

function createHorizontalLine(width, top, left) {
  const line = new fabric.Rect({
    left: left,
    top: top,
    width: width - 10,
    height: 2,
    fill: 'red',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    grid: 'line'
  })

  const lineLeft = new fabric.Rect({
    left: line.left,
    top: line.top - 8,
    width: 2,
    height: 10,
    fill: 'red',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    grid: 'line'
  })

  const lineRight = new fabric.Rect({
    left: line.left + line.width,
    top: line.top - 8,
    width: 2,
    height: 10,
    fill: 'red',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    grid: 'line'
  })

  canvas.add(line, lineLeft, lineRight)
}

function createInputTextBottom(left, top, id, section) {
  const input = document.createElement('input')
  input.classList.add('blyd3d-grid-input-field')
  input.type = 'number'
  input.style.position = 'absolute'
  input.style.left = `calc(1em + ${left}px)`
  input.style.top = `calc(1em + ${top}px)`
  input.style.width = '50px' // Largeur du champ de saisie
  input.style.fontSize = '14px'
  input.style.border = '2px solid black'
  input.style.color = 'black'
  input.style.textAlign = 'center'
  input.style.transformOrigin = 'center'
  input.style.transform = 'translate(-50%, -50%)'
  input.setAttribute('min', 1)
  input.style.zIndex = '99999'
  input.setAttribute('data-id', id)
  const search = bottomInputField.filter((e) => e.obj.left === section.left && e.obj.width === section.width)
  if (search.length === 0) {
    document.querySelector('.blyd3d-modal-panel').appendChild(input)

    input.addEventListener('input', function (e) {
      let id = this.getAttribute('data-id')
      console.log('input1 is selected')
      let obj = canvas.getObjects().find((obj) => obj.id == id)
      if (typeof obj === 'object') {
        obj.set('provideWidth', e.target.value)
        if (obj.anoter) {
          obj.anoter.forEach((subId) => {
            let found = canvas.getObjects().find((subObj) => subObj.id == subId && obj.left === subObj.left && obj.width === subObj.width)
            if (found) found.set('provideWidth', e.target.value)
          })
        }
      }
    })

    bottomInputField.push({ left: left, width: section.width, id: id, input: input, obj: section })
    return true
  } else {
    if (!search[0].obj.anoter) search[0].obj.anoter = []
    search[0].obj.anoter.push(id)
    return false
  }
}

function createInputTextLeft(left, top, id, section) {
  const input = document.createElement('input')
  input.classList.add('blyd3d-grid-input-field')
  input.type = 'number'
  input.style.position = 'absolute'
  input.style.left = `calc(1em + ${left}px)`
  input.style.top = `calc(1em + ${top + 5}px)`
  input.style.width = '50px' // Largeur du champ de saisie
  input.style.fontSize = '14px'
  input.style.border = '2px solid black'
  input.style.color = 'black'
  input.style.textAlign = 'center'
  input.style.transformOrigin = 'center'
  input.style.transform = 'rotate(90deg)'
  input.setAttribute('min', 1)
  input.style.zIndex = '999999'
  input.setAttribute('data-id', id)

  const search = leftInputField.filter((e) => e.obj.top === section.top && e.obj.height === section.height && e.id !== section.id)

  if (search.length === 0) {
    document.querySelector('.blyd3d-modal-panel').appendChild(input)
    input.addEventListener('input', function (e) {
      console.log('input is selected')
      let id = this.getAttribute('data-id')
      let obj = canvas.getObjects().find((obj) => obj.id == id)
      if (typeof obj === 'object') {
        obj.set('provideHeight', e.target.value)
        if (obj.anoter) {
          obj.anoter.forEach((subId) => {
            let found = canvas.getObjects().find((subObj) => subObj.id == subId && obj.top === subObj.top && obj.height === subObj.height)
            if (found) found.set('provideHeight', e.target.value)
          })
        }
      }
    })

    leftInputField.push({ top: top, height: section.height, id: id, input: input, obj: section })

    return true
  } else {
    if (!search[0].obj.anoter) search[0].obj.anoter = []
    search[0].obj.anoter.push(id)
    return false
  }
}

function getSectionSizes() {
  const rectangles = canvas.getObjects('rect').filter((obj) => obj.section === 'grid')

  // Utiliser reduce pour trouver les valeurs maximales de droite et de bas
  const { rightmost, bottommost } = rectangles.reduce(
    (acc, rect) => {
      const rightEdge = rect.left + rect.width
      const bottomEdge = rect.top + rect.height

      return {
        rightmost: Math.max(acc.rightmost, rightEdge),
        bottommost: Math.max(acc.bottommost, bottomEdge)
      }
    },
    { rightmost: 0, bottommost: 0 }
  )

  return {
    height: bottommost,
    width: rightmost
  }
}

/**
 * Add input fields on canvas.
 * @param {mixed} subdividedZones
 * @returns
 */
const addInputFields = () => {
  const sectionSizes = getSectionSizes()
  const sections = canvas
    .getObjects('rect')
    .filter((obj) => obj.section === 'grid')
    .sort((a, b) => a.left - b.left)

  let actualLeft = null,
    matrix = [],
    row = 0,
    column = 0

  sections.forEach((section) => {
    if (actualLeft != null && section.left != actualLeft) {
      row = 0
      column += 1
    }

    if (!matrix[column]) matrix[column] = []

    matrix[column][row] = section

    actualLeft = section.left
    row += 1
  })

  const top = objTop + sectionSizes.height
  const left = objLeft - 50
  const intervale = 30

  for (let col = 0; col < matrix.length; col++) {
    const column = matrix[col].sort((a, b) => a.top - b.top)
    matrix[col] = column
  }

  matrix.forEach((column, col) => {
    column.forEach((section, row) => {
      let h = createInputTextBottom(section.left + section.width / 2, top + intervale * row, section.id, section)
      let v = createInputTextLeft(left - intervale * col, section.top + section.height / 2, section.id, section)
      if (h) createHorizontalLine(section.width, top + intervale * row, section.left)
      if (v) createVerticalLine(section.height, section.top, left - intervale * col)
    })
  })
}

function fetchSvgContent(svgUrl, width, height) {
  return fetch(svgUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text()
    })
    .then((svgContent) => {
      // Créer un div temporaire pour contenir le SVG
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = svgContent
      const svgElm = tempDiv.querySelector('svg')

      if (svgElm) {
        // Ajuster la taille du SVG

        svgElm.style.width = '100%'
        svgElm.style.height = '100%'
        // svgElm.setAttribute("width", width);
        // svgElm.setAttribute("height", height);
        // svgElm.setAttribute("preserveAspectRatio", "none");

        // Retourner le contenu HTML du SVG sous forme de chaîne
        return tempDiv.innerHTML
      } else {
        throw new Error('No SVG element found in the fetched content')
      }
    })
    .catch((error) => {
      console.error('Failed to fetch SVG:', error)
      throw error
    })
}

/**
 * Add input fields on canvas.
 * @param {mixed} subdividedZones
 * @returns
 */
const addSelectFields = (subdividedZones) => {
  // Trouver le rectangle dessiné par l'utilisateur
  const drawnRect = getSubdiviseSizes()

  if (!drawnRect) return

  if (document.querySelectorAll('.blyd3d-grid-input-field').length > 0)
    document.querySelectorAll('.blyd3d-grid-input-field').forEach((e) => {
      e.style.display = 'none'
    })

  if (document.querySelectorAll('.blyd3d-grid-type-field').length > 0)
    document.querySelectorAll('.blyd3d-grid-type-field').forEach((e) => {
      e.remove()
    })

  canvas.getObjects().find((obj) => {
    if (obj.grid == 'line') canvas.remove(obj)
  })
  // Décalage pour positionner les champs de saisie autour du rectangle
  subdividedZones
    .sort((a, b) => a.top - b.top)
    .forEach((zone, index) => {
      const subDiv = document.createElement('div')
      subDiv.classList.add('blyd3d-grid-type-field')
      subDiv.style.position = 'absolute'
      subDiv.style.left = `calc(1em + ${zone.left + zone.width / 2}px)`
      subDiv.style.top = `calc(1em + ${zone.top + zone.height / 2}px)`
      subDiv.style.width = `${zone.width}px`
      subDiv.style.height = `${zone.height}px` // Largeur du champ de saisie
      subDiv.style.border = '2px solid red'
      subDiv.style.backgroundColor = 'blue'
      subDiv.style.transform = 'translate(-50%, -50%)'
      subDiv.style.transformOrigin = 'center'
      subDiv.setAttribute('id', zone.id)
      subDiv.setAttribute('data-item-id', index)
      subDiv.setAttribute('draggable', 'true')
      subDiv.setAttribute('contenteditable', 'true')
      subDiv.style.zIndex = '999'
      subDiv.style.opacity = 0.6
      subDiv.style.cursor = 'pointer'
      subDiv.style.textAlign = 'center'
      subDiv.innerText = 'Item ' + (index + 1)
      subDiv.style.display = 'flex'
      subDiv.style.justifyContent = 'center'
      subDiv.style.alignItems = 'center'
      subDiv.style.color = '#fff'

      subDiv.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', subDiv.id)
      })

      subDiv.addEventListener('drop', (event) => {
        event.preventDefault()
        let id = zone.id
        const data = event.dataTransfer.getData('text/plain')
        const draggedElement = document.getElementById(data)

        // Copie des attributs de l'élément glissé sur l'élément de dépôt
        subDiv.innerText = draggedElement.innerText
        subDiv.setAttribute('data-item', draggedElement.getAttribute('data-item'))
        canvas.getObjects().find((obj) => {
          if (obj.id == id) obj.set('alupco', draggedElement.innerText)
        })
      })

      // Empêche le comportement par défaut pour permettre le glisser-déposer
      subDiv.addEventListener('dragover', (event) => {
        event.preventDefault()
      })

      document.querySelector('.blyd3d-modal-panel').appendChild(subDiv)

      document.querySelectorAll('.blyd3d-grid-type-field').forEach((e) => {
        e.addEventListener('mouseover', function () {
          this.style.opacity = 0.3
        })

        e.addEventListener('mouseout', function () {
          this.style.opacity = 0.6
        })

        e.addEventListener('click', function () {
          document.querySelector('.blyd3d-modal-panel-item-type').classList.remove('blyd3d-hide')
          document.getElementById('blyd3d-display-item-type').setAttribute('data-id', this.id)
        })
      })

      document.getElementById('blyd3d-display-item-type').addEventListener('click', function () {
        let id = this.getAttribute('data-id')
        let alupcoName = document.getElementById('blyd3d-item-type-active').getAttribute('data-name')
        document.getElementById(id).innerText = alupcoName
        document.getElementById(id).setAttribute('data-item', document.getElementById('blyd3d-item-type-active').value)
        document.querySelector('.blyd3d-modal-panel-item-type').classList.add('blyd3d-hide')
        document.getElementById(id).style.backgroundColor = 'blue'
        canvas.getObjects().find((obj) => {
          if (obj.id == id) obj.set('alupco', alupcoName)
        })
      })
    })
}

const drawBarGrid = () => {
  canvas.getObjects().forEach((e) => {
    e.set({ visible: false })
  })

  document.querySelectorAll('.blyd3d-grid-type-field').forEach((e) => {
    let itemName = e.innerText
    const options = getParentByKey(alupco, 'name')
    options.forEach((el) => {
      if (el.name == itemName) {
        let svgPath = el['2d']
        fetchSvgContent(svgPath, e.offsetWidth, e.offsetHeight).then((svgHtml) => {
          // Créer un div temporaire pour insérer le contenu SVG
          const tempDiv = document.createElement('div')
          tempDiv.classList.add('blyd3d-alupco-2d-svg')
          tempDiv.innerHTML = svgHtml

          tempDiv.style.position = 'absolute'
          tempDiv.style.width = `max-content`
          tempDiv.style.height = `max-content`
          tempDiv.style.left = e.style.left
          tempDiv.style.top = e.style.top
          tempDiv.style.transform = 'translate(-50%, -50%)'
          tempDiv.style.transformOrigin = 'center'
          tempDiv.style.width = e.offsetWidth + 'px'
          tempDiv.style.height = e.offsetHeight + 'px'
          document.querySelector('.blyd3d-modal-panel').appendChild(tempDiv)
          e.classList.add('blyd3d-hide')
        })
      }
    })
  })
}

const addPrevNextAction = () => {
  // Ajout de l'evenement lorsqu'on appui sur le bouton 'next'.
  document.getElementById('blyd3d-step-next').addEventListener('click', function () {
    if (drawGridStep === 0) {
      document.getElementById('blyd3d-step-done').setAttribute('data-action', 'default')
      document.querySelector('.blyd3d-second-step').classList.remove('blyd3d-hide')
      document.querySelector('.blyd3d-first-step').classList.add('blyd3d-hide')

      lockDrawing = true

      canvas
        .getObjects()
        .filter((obj) => obj.gridId === 'rectangularForm')
        .forEach((obj) => {
          const newObjWidth = canvas.width - (canvas.width * 30) / 100
          const newObjHeight = canvas.height - (canvas.height * 30) / 100
          const objHeight = obj.height
          const objWidth = obj.width
          const newRealHeight = objHeight / (objWidth / newObjWidth)
          const newRealWidth = objWidth / (objHeight / newObjHeight)

          // Redimensionne l'objet par rapport à la taille du canvas.
          if (obj.width > obj.height) {
            obj.set({
              width: newObjWidth,
              height: newObjHeight > newRealHeight ? newRealHeight : newObjHeight
            })
          } else if (obj.width < obj.height) {
            obj.set({
              width: newObjWidth > newRealWidth ? newRealWidth : newObjWidth,
              height: newObjHeight
            })
          } else {
            obj.set({
              width: newObjHeight,
              height: newObjHeight
            })
          }

          // Centrer l'objet.
          obj.center()
          objTop = (canvas.height * 5) / 100
          objLeft = obj.left
          globalObjHeight = obj.height
          globalObjWidth = obj.width
          obj.set({ top: objTop })
          canvas.renderAll()
        })

      if (splitLine) {
        canvas.remove(splitLine)
      }

      canvas.renderAll()

      drawGridStep += 1
    } else if (drawGridStep === 1) {
      const drawnRect = canvas.getObjects().find((obj) => obj.section === 'grid')
      if (!drawnRect) return
      document.querySelector('.blyd3d-second-step').classList.add('blyd3d-hide')
      document.querySelector('.blyd3d-first-step').classList.add('blyd3d-hide')
      lockDrawing = true
      lockSpliting = true
      addInputFields()
      saveGridData(getSubdiviseSizes())
      canvas.renderAll()
      drawGridStep += 1
      undoStack = []
      document.querySelectorAll('.blyd3d-stack-action').forEach((e) => {
        e.classList.add('blyd3d-hide')
      })
    } else if (drawGridStep === 2) {
      var isFieldEmpty = false
      document.querySelectorAll('.blyd3d-grid-input-field').forEach((e) => {
        if (e.value == '') {
          isFieldEmpty = true
          e.style.borderColor = 'red'
        }
      })

      if (isFieldEmpty) return
      addSelectFields(getSubdiviseSizes())
      // document.getElementById("blyd3d-step-done").classList.remove("blyd3d-hide");
      document.getElementById('blyd3d-step-done').setAttribute('data-action', 'grid')
      // document.getElementById("blyd3d-step-next").classList.add("blyd3d-hide");
      saveGridData(getSubdiviseSizes())
      drawGridStep += 1
      undoStack = []
      document.querySelectorAll('.blyd3d-stack-action').forEach((e) => {
        e.classList.add('blyd3d-hide')
      })
    } else if (drawGridStep === 3) {
      let valid = true
      document.querySelectorAll('.blyd3d-grid-type-field').forEach((e) => {
        let itemName = e.innerText
        let found = false

        const options = getParentByKey(alupco, 'name')
        options.forEach((el) => {
          if (el.name == itemName) found = true
        })

        if (!found) {
          valid = false
          e.style.backgroundColor = 'red'
        }
      })

      if (!valid) return

      drawBarGrid()
      document.getElementById('blyd3d-step-done').classList.remove('blyd3d-hide')
      document.getElementById('blyd3d-step-next').classList.add('blyd3d-hide')
      document.querySelectorAll('.blyd3d-stack-action').forEach((e) => {
        e.classList.add('blyd3d-hide')
      })
      drawGridStep += 1
      undoStack = []
    } else if (drawGridStep === 4) {
      lockDrawing = true
      lockSpliting = true
      document.getElementById('blyd3d-step-next').classList.add('blyd3d-hide')
      document.getElementById('blyd3d-step-done').attributes.remove('disabled')
    }
    canvas.renderAll()
  })
}

let undoStack = []
let redoStack = []
let saveAttributes = [
  'selectable',
  'visible',
  'border',
  'hasBorders',
  'id',
  'section',
  'gridId',
  'provideHeight',
  'provideWidth',
  'hasBorders',
  'fill',
  'opacity',
  'survol',
  'height',
  'width',
  'top',
  'left',
  'stroke',
  'strokeWidth',
  'typeSurvol',
  'type',
  'grid'
]

const saveState = () => {
  const canvasState = JSON.stringify(canvas.toJSON(saveAttributes))
  undoStack.push(canvasState)
  redoStack = [] // Clear redo stack
}

// eslint-disable-next-line react-refresh/only-export-components
export const undo = () => {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop()
    redoStack.push(JSON.stringify(canvas.toJSON(saveAttributes)))
    canvas.loadFromJSON(lastState, canvas.renderAll.bind(canvas))
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const redo = () => {
  if (redoStack.length > 0) {
    const lastState = redoStack.pop()
    undoStack.push(JSON.stringify(canvas.toJSON(saveAttributes)))
    canvas.loadFromJSON(lastState, canvas.renderAll.bind(canvas))
  }
}

function FabricCanvas() {
  const canvasRef = useRef(null)
  const isInit = useRef(false)

  useEffect(() => {
    canvas = new fabric.Canvas(canvasRef.current, {
      width: document.querySelector('.blyd3d-modal-panel .blyd3d-left-bloc').offsetWidth,
      height: document.querySelector('.blyd3d-modal-panel .blyd3d-left-bloc').offsetHeight
    })

    topRuler = new fabric.StaticCanvas('top-ruler')
    leftRuler = new fabric.StaticCanvas('left-ruler')

    drawGrid()

    topRuler.setDimensions({
      width: canvas.width,
      height: 45
    })
    leftRuler.setDimensions({
      width: 45,
      height: canvas.height
    })

    console.log(topRuler.width, leftRuler.height)

    // redrawRulers()

    loadDefaultEvent()
    loadCanvasEvent()
    if (!isInit.current) {
      addPrevNextAction()
      isInit.current = true
    }

    // Ajoutez votre code de fabric.js ici

    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    // <table>
    //   <tr>
    //     <td></td>
    //     <td>
    //       <canvas id="top-ruler" />
    //     </td>
    //   </tr>
    //   <tr>
    //     <td>
    //       <canvas id="left-ruler" />
    //     </td>
    //     <td>
          <canvas id="blyd3d-grid-canvas" ref={canvasRef} />
    //     </td>
    //   </tr>
    // </table>
  )
}

export default FabricCanvas
