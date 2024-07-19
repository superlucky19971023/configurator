import * as THREE from 'three'

const alupcoBorder = {
    top: 'FRM-RAIL-T-BRDR',
    bottom: 'FRM-RAIL-B-BRDR',
    left: 'FRM-SIDE-L-BRDR',
    right: 'FRM-SIDE-R-BRDR',

    cornerTopRight: 'FRM-RAIL-T-BRDR-R-END',
    cornerTopLeft: 'FRM-RAIL-T-BRDR-L-END',

    cornerTopRightEnd: 'FRM-RAIL-T-BRDR-R-END-NTCH',
    cornerTopLeftEnd: 'FRM-RAIL-T-BRDR-L-END-NTCH',

    cornerTopRightSide: 'FRM-SIDE-R-BRDR-T-END',
    cornerTopLeftSide: 'FRM-SIDE-L-BRDR-T-END',

    cornerBottomRight: 'FRM-RAIL-B-BRDR-R-END',
    cornerBottomLeft: 'FRM-RAIL-B-BRDR-L-END',

    cornerBottomNtchLeft: 'RAIL-B-BRDR-L-END-NTCH',
    cornerBottomNtchRight: 'RAIL-B-BRDR-R-END-NTCH',

    cornerBottomNtchLeftEnd: 'RAIL-B-BRDR-L-END-NTCH',
    cornerBottomNtchRightEnd: 'RAIL-B-BRDR-R-END-NTCH',

    cornerSideTopLeftEnd: 'SIDE-L-BRDR-T-END-NTCH',
    cornerSideBottomLeftEnd: 'SIDE-L-BRDR-B-END-NTCH',

    cornerSideTopRightEnd: 'SIDE-R-BRDR-T-END-NTCH',

    cornerBottomRightEnd: 'FRM-SIDE-R-BRDR-B-END',
    cornerBottomLeftEnd: 'FRM-SIDE-L-BRDR-B-END',

    cornerBottomRightSide: 'SIDE-R-BRDR-B-END',
    cornerBottomLeftSide: 'SIDE-L-BRDR-B-END',
    cornerBottomRightSideNtch: 'SIDE-R-BRDR-B-END-NTCH'
    
}

export const hideModelBar = async (model, pos) => {
    // Mappage des éléments à supprimer selon la position
    const bordersToHide = {
        top: [
            alupcoBorder.top,
            alupcoBorder.cornerTopRight,
            alupcoBorder.cornerTopLeft,
            alupcoBorder.cornerTopRightEnd,
            alupcoBorder.cornerTopLeftEnd,
            alupcoBorder.cornerTopRightSide,
            alupcoBorder.cornerTopLeftSide,
        ],
        bottom: [
            alupcoBorder.bottom,
            alupcoBorder.cornerBottomLeft,
            alupcoBorder.cornerBottomNtchLeft,
            alupcoBorder.cornerBottomLeftEnd,
            alupcoBorder.cornerBottomRight,
            alupcoBorder.cornerBottomNtchRight,
            alupcoBorder.cornerBottomRightEnd,
        ],
        left: [
            alupcoBorder.left,
            alupcoBorder.cornerTopLeft,
            alupcoBorder.cornerBottomLeftEnd,

            // alupcoBorder.cornerTopLeftEnd,
            alupcoBorder.cornerBottomLeft,

            alupcoBorder.cornerBottomLeftSide,
            alupcoBorder.cornerTopLeftSide,

            alupcoBorder.cornerSideTopLeftEnd,
            alupcoBorder.cornerSideBottomLeftEnd
        ],
        right: [
            alupcoBorder.right,
            alupcoBorder.cornerTopRight,
            alupcoBorder.cornerBottomRightEnd,
            // alupcoBorder.cornerTopRightEnd,
            alupcoBorder.cornerBottomRight,
            alupcoBorder.cornerBottomRightSide,
            alupcoBorder.cornerTopRightSide,
            alupcoBorder.cornerSideTopRightEnd,
            alupcoBorder.cornerBottomRightSideNtch
        ],
    };

    model.updateMatrixWorld(true);

    return new Promise((resolve, reject) => {
        function findAndHide(object) {
            if (object.children && Array.isArray(object.children)) {
                object.children = object.children.filter((child) => {
                    const shouldHide = bordersToHide[pos].some((border) => child.name.endsWith(border));
                    if (shouldHide) {
                        child.visible = false;
                        child.updateMatrixWorld(true);
                    }
                    return !shouldHide; // Garder seulement les éléments non supprimés
                });

                // Appel récursif sur les enfants restants
                object.children.forEach(findAndHide);
            }
        }

        const hiddenSize = getChildSize(model, bordersToHide[pos][0]);

        findAndHide(model);
        model.updateMatrixWorld(true);

        resolve(hiddenSize);
    })
};

export const hideModelPart = async (model, name) => {
    model.updateMatrixWorld(true);

    return new Promise((resolve, reject) => {
        function findAndHide(object) {
            if (object.children && Array.isArray(object.children)) {
                object.children = object.children.filter((child) => {
                    if (child.name.includes(name)) {
                        child.visible = false;
                        child.updateMatrixWorld(true);
                    }
                    return child.visible; // Conserve uniquement les enfants visibles
                });

                // Appel récursif sur les enfants restants
                object.children.forEach(findAndHide);
            }
        }

        findAndHide(model);
        model.updateMatrixWorld(true);

        resolve(model); // Résoudre la promesse avec le modèle mis à jour
    });
};



const mesureObject = (obj) => {
    return new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3())
}

const getChildSize = (model, name) => {
    let search = { x: 0, y: 0 }
    function findChildInObject(object) {
        if (object.children && Array.isArray(object.children)) {
            // Appeler récursivement cette fonction pour chaque enfantZ
            object.children.forEach(child => {
                child.updateMatrixWorld(true);
                const size = mesureObject(child);
                if (child.name.endsWith(name)) {
                    search = size;
                } else {
                    findChildInObject(child);
                }
            });
        }
    }

    // Démarrer la recherche d'enfants à partir du modèle fourni
    findChildInObject(model);

    return search;
}

/**
 * Resize fixed window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */

export const resizeFixedWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        const barSize = 0.032593;
        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        let scaleY = height / fixedWindowSize.y;


        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        let scaleX = width / fixedWindowSize.x;
        

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 2) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R") ||
                        childName.endsWith("-DIVIDER-TSEC-1-000") ||
                        childName.endsWith("-DIVIDER-TSEC-2-000") ||
                        childName.endsWith("-DIVIDER-TSEC-3-000")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.includes("ILPRFL")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);

        const newFixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        scaleY = height / newFixedWindowSize.y;


        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        scaleX = width / newFixedWindowSize.x;

        model.scale.set(scaleX, scaleY, 1);

        model.newScale = {x: scaleX, y: scaleY};

        resolve(model);
    });
};


/**
 * Resize 2T 2S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
// Fonction principale pour redimensionner la fenêtre
export const resize2T2SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        let scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        let scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 2) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.endsWith("SIDE-L-ILPRFL-T") ||
                        childName.endsWith("SIDE-L-ILPRFL-B") ||
                        childName.endsWith("SIDE-R-ILPRFL-T") ||
                        childName.endsWith("SIDE-R-ILPRFL-B")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);

        const newFixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        scaleY = height / newFixedWindowSize.y;


        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        scaleX = width / newFixedWindowSize.x;

        model.scale.set(scaleX, scaleY, 1);

        model.newScale = {x: scaleX, y: scaleY};

        resolve(model);
    });
};


/**
 * Resize 2T 3S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resize2T3SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        const scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        const scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 3) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.includes("ILPRFL")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);
        resolve(model);
    });
};

/**
 * Resize 2T 4S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resize2T4SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        const scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        const scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 4) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.includes("ILPRFL")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);
        resolve(model);
    });
};

/**
 * Resize 3T 3S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resize3T3SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        const scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        const scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 3) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.includes("ILPRFL")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);
        resolve(model);
    });
};


/**
 * Resize 3T 6S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resize3T6SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        const scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        const scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 6) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.includes("ILPRFL")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);
        resolve(model);
    });
};

/**
 * Resize 4T 4S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resize4T4SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        const scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        const scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B")
                    ) {
                        let r = ((width / 4) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.includes("ILPRFL")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);
        resolve(model);
    });
};


/**
 * Resize 4T 8S window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resize4T8SWindow = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        const scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        const scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B") ||
                        childName.endsWith("SSH-RAIL-B001") ||
                        childName.endsWith("SSH-RAIL-T001")
                    ) {
                        let r = ((width / 8) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R")
                    ) {
                        let mult = 2;
                        if (width > height) mult = 1;
                        let r = (height - cornerSizes.y * mult) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L001") ||
                        childName.endsWith("SSH-SIDE-R001")
                    ) {
                        let mult = 4;
                        if (width > height) mult = 2;
                        let r = (height - cornerSizes.y * mult) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        let mult = 4;
                        if (width > height) mult = 2;
                        let r = (height - cornerSizes.y * mult) / size.y;
                        child.scale.y *= r;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.endsWith("SIDE-L-ILPRFL-T") ||
                        childName.endsWith("SIDE-L-ILPRFL-B") ||
                        childName.includes("SSH-CRNR-HW-RLR") ||
                        childName.endsWith("SSH-SIDE-R-CPPRFL-T") ||
                        childName.endsWith("SSH-SIDE-R-CPPRFL-B")
                    ) {
                        child.scale.y *= scale;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);
        resolve(model);
    });
};

/**
 * Resize window.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 * @param {int} number This is the pannel number.
 */
export const resizeWindow = async (model, height, width, number) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        let scaleY = height / fixedWindowSize.y;

        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        let scaleX = width / fixedWindowSize.x;

        /**
         * Calcule de nouvelle facteur de décallage pour les différents coins.
         */
        const scale = Math.min(scaleX, scaleY);

        const cornerSizes = getChildSize(model, "0-0-FRM-CRNR-TR");

        function findChildInObject(object) {
            if (object.children && Array.isArray(object.children)) {

                object.children.forEach(child => {
                    findChildInObject(child); // Appeler récursivement cette fonction pour chaque enfant

                    const childName = child.name;
                    child.updateMatrixWorld(true);
                    const size = mesureObject(child);

                    if (
                        childName.endsWith("FRM-RAIL-T") ||
                        childName.endsWith("FRM-RAIL-B")
                    ) {
                        let r = (width - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("SSH-RAIL-T") ||
                        childName.endsWith("SSH-RAIL-B") ||
                        childName.endsWith("FSC-RAIL-T") ||
                        childName.endsWith("FSC-RAIL-B") ||
                        childName.endsWith("SSH-RAIL-B001") ||
                        childName.endsWith("SSH-RAIL-T001")
                    ) {
                        let r = ((width / number) - cornerSizes.x) / size.x;
                        child.scale.x *= r;
                    } else if (
                        childName.endsWith("FRM-SIDE-L") ||
                        childName.endsWith("FRM-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L") ||
                        childName.endsWith("SSH-SIDE-R") ||
                        childName.endsWith("FSC-SIDE-L") ||
                        childName.endsWith("FSC-SIDE-R") ||
                        childName.endsWith("SSH-SIDE-L001") ||
                        childName.endsWith("SSH-SIDE-R001")
                    ) {
                        let r = (height - cornerSizes.x) / size.y;
                        child.scale.y *= r;
                    } else if (
                        childName.includes("SSH-FSC-FSC-NET") ||
                        childName.includes("SSH-GLZ-OUT") ||
                        childName.includes("SSH-GLZ-IN")
                    ) {
                        child.scale.y *= scaleY;
                        child.scale.x *= scaleX;
                    } else if (
                        childName.includes("SSH-ANNO-ARROW-C") ||
                        childName.includes("SSH-ANNO-FIXED-C")
                    ) {
                        child.scale.y *= scale;
                        child.scale.x *= scale;
                    } else if (
                        childName.endsWith("SIDE-L-ILPRFL-T") ||
                        childName.endsWith("SIDE-L-ILPRFL-B") ||
                        childName.endsWith("SIDE-R-ILPRFL-T") ||
                        childName.endsWith("SIDE-R-ILPRFL-B") ||
                        childName.endsWith("SIDE-R-CPPRFL-T") ||
                        childName.endsWith("SIDE-R-CPPRFL-B")
                    ) {
                        child.scale.y *= scaleY;
                    }

                    child.position.x *= scaleX;
                    child.position.y *= scaleY;

                    child.updateMatrixWorld(true);
                });
            }
        }

        findChildInObject(model);

        model.updateMatrixWorld(true);

        const newFixedWindowSize = mesureObject(model);

        /**
         * Calcule de nouvelle facteur de décallage pour la hauteur.
         */
        scaleY = height / newFixedWindowSize.y;


        /**
         * Calcule de nouvelle facteur de décallage pour la largeur.
         */
        scaleX = width / newFixedWindowSize.x;

        model.scale.set(scaleX, scaleY, 1);

        model.newScale = {x: scaleX, y: scaleY};
        resolve(model);
    });
};

/**
 * Resize object.
 * @param {THREE.Object3D} model 
 * @param {int} height The new model height.
 * @param {int} width The new model width.
 */
export const resizeObject = async (model, height, width) => {
    return new Promise((resolve, reject) => {
        model.updateMatrixWorld(true);
        const fixedWindowSize = mesureObject(model);
        const scaleY = height / fixedWindowSize.y;
        const scaleX = width / fixedWindowSize.x;
        model.scale.set(scaleX, scaleY, 1);

        resolve(model);
    })
};