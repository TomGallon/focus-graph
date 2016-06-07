import React , {Component, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';
import find from 'lodash/find';

const FIELD_CONTEXT_TYPE = {
    fieldHelpers: PropTypes.object
};

const getFieldMetadata = (propertyName, entityPath, definitions, domains) => {
    const propertyDefinition = definitions[entityPath][propertyName];
    if (!propertyDefinition) throw new Error(`Property ${propertyName} does not exist in definition ${entityPath}`);
    return {
        isRequired: propertyDefinition.isRequired,
        ...domains[propertyDefinition.domain]
    }
}

const getTestFieldMetadata = (propertyName, entityPath = {}, definitions, domains) => {
  const propertyDefinition = definitions[entityPath]
  return {
    isRequired: propertyDefinition.isRequired,
    ...domains[propertyDefinition.domain]
  };
}

const fieldForBuilder = (props, multiple = false, list = false, fieldForListBuilder) => (propertyName, {FieldComponent = DefaultFieldComponent, redirectEntityPath, entityPath, onBlur: userDefinedOnBlur, ...options} = {}) => {
    const {fields, definitions, domains, onInputChange, onInputBlur, entityPathArray, editing} = props;
    // Check if the form has multiple entityPath. If it's the case, then check if an entityPath for the field is provided
    // todo: souldn't it check if the property exists in both entity path from the array and throw an error if it is so.
    // Maybe the cost is too high.
    if (entityPathArray.length > 1 && !entityPath) throw new Error(`You must provide an entityPath when calling fieldFor('${propertyName}') since the form has multiple entityPath ${entityPathArray}`);
    entityPath = entityPath ? entityPath : entityPathArray[0];
    const metadata = list ? getTestFieldMetadata(propertyName, redirectEntityPath, definitions, domains) :  getFieldMetadata(propertyName, entityPath, definitions, domains);

    const field =  find(fields, {entityPath, name: propertyName});
    const {rawInputValue} = field || {};
    const onChange = rawValue => {
        onInputChange(propertyName, entityPath, rawValue);
        if (options.onChange) options.onChange(rawValue);
    };

    // Construct the onBlur, with the validation if validateOnBlur has not been set to false in the domain
    const onBlur = () => {
        if (definitions[entityPath][propertyName].validateOnBlur !== false) onInputBlur(propertyName, entityPath, rawInputValue);
        if (userDefinedOnBlur) userDefinedOnBlur();
    };
    const fieldForLine = list ? fieldForListBuilder(entityPath, propertyName)(props): {};
    return <FieldComponent {...options} {...field} fieldForLine={fieldForLine} multiple={multiple} list= {list} editing={editing} name={propertyName} onBlur={onBlur} onChange={onChange} metadata={metadata} />;
}


const fieldForListBuilder = (entityPathList, propertyNameList) => {
  const fieldForLineBuilder = (connectedComponentProps) => (propertyName, {FieldComponent = DefaultFieldComponent, entityPath, onBlur: userDefinedOnBlur, ...options} = {}, index) => {
      const {fields, definitions, domains, onInputChange, onInputBlur, entityPathArray, editing, onInputBlurList} = connectedComponentProps;
      const fieldTab = find(fields, {name: propertyNameList});
      console.log('il me faut lerreur')
      const metadata = getFieldMetadata(propertyName, entityPath, definitions, domains);
      const field = {
        rawInputValue : fieldTab.dataSetValue[index][propertyName],
        formattedInputValue: fieldTab.dataSetValue[index][propertyName]
      }
      const onChange = rawValue => {
        onInputChange(propertyNameList, entityPathList, fieldTab[index][propertyName]);
        if (options.onChange) options.onChange(rawValue);
      }
      console.log(fieldTab.error[index] && fieldTab.error[index][propertyName])
      const onBlur = () => {
        if (definitions[entityPathList][propertyNameList].validateOnBlur !== false) onInputBlurList(propertyNameList, entityPathList, fieldTab.rawInputValue[index][propertyName], propertyName, index);
        if (userDefinedOnBlur) userDefinedOnBlur();
      }
      return <FieldComponent {...options} {...field} error={fieldTab.error[index] && fieldTab.error[index][propertyName]} test='yolo' editing={editing} name={propertyName} metadata={metadata} onChange={onChange} onBlur={onBlur}/>;
  }
  return fieldForLineBuilder;

}

export function connect() {
    return function connectComponent(ComponentToConnect) {
        function FieldConnectedComponent({_behaviours, ...otherProps}, {fieldHelpers}) {
            const fieldFor = fieldHelpers.fieldForBuilder(otherProps);
            const selectFor = fieldHelpers.fieldForBuilder(otherProps, true);
            const list = fieldHelpers.fieldForBuilder( otherProps, false, true, fieldHelpers.fieldForListBuilder);
            const behaviours = {connectedToFieldHelpers: true, ..._behaviours};
            return <ComponentToConnect {...otherProps} _behaviours={behaviours} fieldFor={fieldFor} selectFor={selectFor} list={list}/>;
        }
        FieldConnectedComponent.displayName = `${ComponentToConnect.displayName}FieldConnected`;
        FieldConnectedComponent.contextTypes = FIELD_CONTEXT_TYPE;
        return FieldConnectedComponent;
    }
}


class FieldProvider extends Component {
    getChildContext() {
        return {
            fieldHelpers: {
                fieldForBuilder,
                fieldForListBuilder
            }
        }
    }
    render() {
        return this.props.children;
    }
}
FieldProvider.defaultProps = {
    FieldComponent: DefaultFieldComponent
}
FieldProvider.childContextTypes = FIELD_CONTEXT_TYPE;

export const Provider = FieldProvider;
