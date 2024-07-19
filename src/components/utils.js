export function getParentByKey(object, searchKey) {
    let results = [];

    function recursiveSearch(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return;
        }

        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                if (key === searchKey) {
                    results.push(obj); // Ajoute le parent direct
                }

                if (typeof obj[key] === 'object') {
                    recursiveSearch(obj[key]);
                }
            }
        }
    }

    recursiveSearch(object);

    return results;
}