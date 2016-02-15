import React , {Component, PropTypes} from 'react';
const DEFINITION_CONTEXT_TYPE = {
  definitions: PropTypes.object
};

export function connect(definitionName){
  //console.log('definition ');
  //check it is a string or an array;
  return function connectComponentToDefinitions(ComponentToConnect){
    function DefinitionConnectedComponent(props, {definitions}){
        const definition = definitions[definitionName];
        //console.log('def', definition, "props", props);
        return <ComponentToConnect hasConnectedToDefinition={true} definition={definition} {...props} />;
    }
    DefinitionConnectedComponent.displayName = `${ComponentToConnect.displayName}DefinitionConnected`;
    DefinitionConnectedComponent.contextTypes = DEFINITION_CONTEXT_TYPE;
    return DefinitionConnectedComponent;
  }

}

class DefinitionsProvider extends Component {
  getChildContext(){
    return {
      definitions: this.props.definitions
    }
  }
  render(){
    return this.props.children;
  }
}

DefinitionsProvider.childContextTypes = DEFINITION_CONTEXT_TYPE;

export const Provider = DefinitionsProvider;