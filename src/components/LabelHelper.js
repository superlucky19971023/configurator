import * as THREE from 'three';
import customFont from '../../public/fonts/gentilis_regular.typeface.json'

class LabelHelper extends THREE.Group {
  constructor(object, text, position) {
    super();

    this.object = object;
    this.text = text;
    this.position = position;

    this.createLabel();
  }

  createLabel() {
    // Import the custom font file
   
    const shapes = customFont.generateShapes(this.text, 0.5);
    const geometry = new THREE.ShapeGeometry(shapes);
    const textGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.copy(this.position);

    this.add(textMesh);
  }

  update(position) {
    this.position.copy(position);
  }
}

export default LabelHelper;