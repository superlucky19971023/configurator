const createWindow2d = (width, height, section = [], handle = {}, canvas) => {
    const firstBorderSize = Math.min(width, height) * 4 / 100;
    const secondBorderSize = firstBorderSize * 2.3;
    const handleWidth = width * 10 / 100;
    const handleHeight = secondBorderSize / 2;

    const box1 = createRectBox(width - secondBorderSize, height - secondBorderSize, secondBorderSize);
    const box2 = createRectBox(width, height, firstBorderSize);
    box1.left += secondBorderSize / 2;
    box1.top += secondBorderSize / 2;

    const vitre = new fabric.Rect({
        fill: '#b9daff',
        width: box1.width - secondBorderSize * 2,
        height: box1.height - secondBorderSize * 2,
        top: box1.top + secondBorderSize,
        left: box1.left + secondBorderSize,
        stroke: "#000",
        strokeWidth: 2,
        selectable: true
    });

    const box = [box1, box2, vitre];

    if(handle.left) {

        for (let index = 0; index < handle.left; index++) {
            const handleLeft = new fabric.Rect({
                fill: '#000',
                width: handleHeight,
                height: handleWidth,
                left: vitre.left  - (secondBorderSize / 2) - (handleHeight / 2),
                top: vitre.top + (vitre.height / (2 * (index + 1))) - handleWidth / 2,
                stroke: "#000",
                strokeWidth: 2,
                selectable: true
            });

            box.push(handleLeft);
        }
    }

    if(handle.right) {
        for (let index = 0; index < handle.right; index++) {
            const handleRight = new fabric.Rect({
                fill: '#000',
                width: handleHeight,
                height: handleWidth,
                left: vitre.left + vitre.width + (secondBorderSize / 2) - (handleHeight / 2),
                top: (vitre.top / (index + 1)) + (vitre.height / 2) - handleWidth / 2,
                stroke: "#000",
                strokeWidth: 2,
                selectable: true
            });

            box.push(handleRight);
        }
    }

    if(handle.top) {
        for (let index = 0; index < handle.top; index++) {
            const handleTop = new fabric.Rect({
                fill: '#000',
                width: handleWidth,
                height: handleHeight,
                top: (secondBorderSize / 2) + box2.top + handleHeight / 2,
                left: (box2.left / index + 1) + (box2.width / 2) - handleWidth / 2,
                stroke: "#000",
                strokeWidth: 2,
                selectable: true
            });

            box.push(handleTop);
        }
    }

    if(handle.bottom) {
        for (let index = 0; index < handle.bottom; index++) {
            const handleBottom = new fabric.Rect({
                fill: '#000',
                width: handleWidth,
                height: handleHeight,
                top: vitre.top + vitre.height + handleHeight / 2,
                left: box2.left / (index + 1) + (box2.width / 2) - handleWidth / 2,
                stroke: "#000",
                strokeWidth: 2,
                selectable: true
            });
        
            box.push(handleBottom);
        }
    }

    const hRatio = Math.min(width, vitre.width) / Math.max(width, vitre.width);
    const vRatio = Math.min(height, vitre.height) / Math.max(height, vitre.height);

    let vSpace = (canvas.width - vitre.width) / 2;
    let hSpace = (canvas.height - vitre.height) / 2;
    let minLeft = 0;
    let mintTop = 0;

    section.forEach(sub => {
        const top = sub.top * vRatio;
        const left = sub.left * hRatio;
        if(minLeft == 0) minLeft = left;
        if(left < minLeft) minLeft = left;

        if(mintTop == 0) mintTop = top;
        if(top < mintTop) mintTop = top;
    });

    const subObj = [];
    section.forEach(sub => {
        const h = sub.height * vRatio;
        const w = sub.width * hRatio;
        const left = sub.left * hRatio;
        const top = sub.top * vRatio;
        const vsub = new fabric.Rect({
            fill: 'gray',
            width: secondBorderSize,
            height: h,
            left: left,
            top: top,
            stroke: "#000",
            strokeWidth: 2,
            selectable: true
        });

        const hsub = new fabric.Rect({
            fill: 'gray',
            width: w,
            height: secondBorderSize,
            left: left,
            top: top,
            stroke: "#000",
            strokeWidth: 2,
            selectable: true
        });

        if(minLeft == vsub.left) {
            vsub.set("visible", false);
        }

        if(mintTop == top) {
            hsub.set("visible", false);
        }

        subObj.push(hsub, vsub);
        hsub.bringToFront();
        vsub.sendToBack();
    });

    let subGrp = new fabric.Group(subObj, { selectable: true, left: vitre.left, top: vitre.left });

    box.push(subGrp);
    
    return new fabric.Group(box, { selectable: true, grid: "bars" });
}


const calculateHorizontalSubdivisions = (vsubdivize, hsubdivize, vitre, secondBorderSize, firstBorderSize) => {
    const box = [];
    const prev = [];

    vsubdivize.forEach((vsub, vkey) => {
        hsubdivize.forEach((hsub, hkey) => {
            if (!prev[hkey]) prev[hkey] = [];

            const border = firstBorderSize + secondBorderSize;

            // Calculez la largeur de la subdivision
            let hwidth = (vsub.left * vRatio) - secondBorderSize / 2;

            // Calculez la position gauche
            let left = hwidth;

            // Ajustez la largeur et la position si des subdivisions précédentes existent
            if (prev[hkey][vkey - 1]) {
                hwidth = hwidth - prev[hkey][vkey - 1].width;
                hwidth -= secondBorderSize;  // Ajustement de la largeur
                left += prev[hkey][vkey - 1].left - border;
            }

            // Correction des décalages
            left -= hwidth;
            hwidth -= border;
            left += border;

            // Créez la subdivision
            const sub = new fabric.Rect({
                fill: 'gray',
                width: hwidth,
                height: secondBorderSize,
                left: left,
                top: (hsub.top * hRatio) - (secondBorderSize / 2),
                stroke: "#000",
                strokeWidth: 2,
                selectable: true,
            });

            prev[hkey][vkey] = sub;

            box.push(sub);

            // Gérer la dernière subdivision
            if (vsubdivize.length === vkey + 1) {
                let iwidth = vitre.width - ((sub.left + sub.width) - secondBorderSize);
                iwidth -= secondBorderSize / 2;
                const isub = new fabric.Rect({
                    fill: 'gray',
                    width: iwidth,
                    height: secondBorderSize,
                    left: sub.left + sub.width + secondBorderSize,
                    top: sub.top,
                    stroke: "#000",
                    strokeWidth: 2,
                    selectable: true,
                });

                box.push(isub);
            }
        });
    });

    return box;
};


export const createRectBox = (width, height, strokeWidth) => {
    const trapezeHeight = strokeWidth;  // Hauteur des trapèzes

    // Trapèze supérieur
    const topBar = createTrapeze(width, width - trapezeHeight * 2, trapezeHeight, "gray", "black", 2);
    topBar.left = 0;
    topBar.top = 0;

    // Trapèze inférieur
    const bottomBar = createTrapeze(width - trapezeHeight * 2, width, trapezeHeight, "gray", "black", 2);
    bottomBar.left = 0;
    bottomBar.top = height - trapezeHeight;

    const vheight = height;

    // Trapèze gauche
    const leftBar = createTrapeze(vheight, vheight - trapezeHeight * 2, trapezeHeight, "gray", "black", 2);
    leftBar.left = 0;
    leftBar.top = vheight;
    leftBar.set("angle", -90);

    // Trapèze droit
    const rightBar = createTrapeze(vheight, vheight - trapezeHeight * 2, trapezeHeight, "gray", "black", 2);
    rightBar.left = width;
    rightBar.top = 0;
    rightBar.set("angle", 90);

    const trapezes = [topBar, bottomBar, leftBar, rightBar];


    return new fabric.Group(trapezes, { selectable: true });
}

export const createTrapeze = (littleBaseWidth, bigBaseWidth, height, color, strokeColor, strokeWidth) => {
    // Positionnement initial (coin supérieur gauche)
    var startX = 50;
    var startY = 50;

    // Définir la largeur du trapèze
    var offset = (bigBaseWidth - littleBaseWidth) / 2;  // Décalage pour centrer le trapèze

    // Calcul des points du trapèze
    var points = [
        { x: startX + offset, y: startY },  // Point supérieur gauche
        { x: startX + offset + littleBaseWidth, y: startY },  // Point supérieur droit
        { x: startX + bigBaseWidth, y: startY + height },  // Point inférieur droit
        { x: startX, y: startY + height }  // Point inférieur gauche
    ];

    // Création du trapèze avec les points définis
    return new fabric.Polygon(points, {
        fill: color,          // Couleur de remplissage
        stroke: strokeColor,  // Couleur du contour
        strokeWidth: strokeWidth,         // Largeur du contour
        selectable: true
    });
}

export default createWindow2d;