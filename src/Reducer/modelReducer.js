const initialState = {
    mainURL:'',
    handleURL:'',
    selectedItem:'',
    profile:'',
    aluminumType:'',
    aluminumColor:'',
    openingType:'',
    glazing:'',
    glassColor:'',
    glassOpacity:0.7,
    glassRoughness:0.3, 
    flyScreen:'',
    modelWidthSize:0,
    modelHeightSize:0,
    border:false,
  };
  
  const model = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_MAIN_URL':
        return { ...state, mainURL: action.payload };
      case 'SET_HANDLE_URL':
        return { ...state, handleURL: action.payload };
      case 'SET_SELECTED_ITEM':
        return { ...state, selectedItem: action.payload };
      case 'SET_PROFILE':
        return { ...state, profile: action.payload };
      case 'SET_ALUMINUM_TYPE':
        return { ...state, aluminumType: action.payload };
      case 'SET_ALUMINUM_COLOR':
        return { ...state, aluminumColor: action.payload };
      case 'SET_OPENING_TYPE':
        return { ...state, openingType: action.payload };
      case 'SET_GLAZING':
        return { ...state, glazing: action.payload };
      case 'SET_GLASS_COLOR':
        return { ...state, glassColor: action.payload };
      case 'SET_GLASS_OPACITY':
        return { ...state, glassOpacity: action.payload };
      case 'SET_GLASS_ROUGHNESS':
        return { ...state, glassRoughness: action.payload };
      case 'SET_FLYSCREEN':
        return { ...state, flyScreen: action.payload };
      case 'SET_MODEL_SIZE_WIDTH':
        return { ...state, modelWidthSize: action.payload };  
      case 'SET_MODEL_SIZE_HEIGHT':
        return { ...state, modelHeightSize: action.payload };  
      case 'SET_BORDER':
        return { ...state, border : action.payload };  
      default:
        return state;
    }
  };
  
  export default model;