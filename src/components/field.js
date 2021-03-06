import React, {PureComponent, PropTypes} from 'react';
import Label from './label';
import DefaultInputComponent from './input';
import DefaultDisplayComponent from './display';
import DefaultSelectComponent from './select';
import SmartSelectComponent from './smart-select';
import DefaultListComponent from './list';
import DefaultTextComponent from './text';
import DefaultSelectDisplayComponent from './select-display';

const FieldLabelValueComponent = ({editing, isRequired, label, name, valid, ValueComponent, rawValid, list}) => (

    <div data-focus='field' className='mdl-grid' data-mode={editing ? 'edit' : 'consult'} data-required={isRequired} data-valid={valid}>
        <div data-focus='field-label-container' className='mdl-cell mdl-cell--top mdl-cell--4-col'>
            <Label name={name} text={label} />
        </div>
        <div data-focus='field-value-container' className='mdl-cell mdl-cell--top mdl-cell--8-col'>
            {ValueComponent}
            {editing && rawValid && !list && <i className="material-icons">check</i>}
        </div>
    </div>
);
FieldLabelValueComponent.displayName = 'FieldLabelValueComponent';


class Field extends PureComponent {
    render() {
        const {textOnly, multiple, list, fieldForLine, ...otherProps} = this.props;
        const {
            TextComponent = DefaultTextComponent,
            DisplayComponent = DefaultDisplayComponent,
            InputComponent = DefaultInputComponent,
            SelectComponent = DefaultSelectComponent,
            SelectDisplayComponent = DefaultSelectDisplayComponent,
            ListComponent = DefaultListComponent
        } = otherProps.metadata;
        const renderConsult = () => list ?  <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectDisplayComponent {...otherProps} /> : <DisplayComponent  {...otherProps} />);
        const renderEdit = () => list ? <ListComponent InputComponent={InputComponent} fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SmartSelectComponent SelectComponent={SelectComponent} {...otherProps}/> : <InputComponent {...otherProps}/>);
        const ValueComponent = otherProps.editing ? renderEdit() : renderConsult();
        return textOnly ? ValueComponent : <FieldLabelValueComponent ValueComponent={ValueComponent} list={list} {...otherProps} />
    }
}
Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.boolean
  ]),
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool
};
export default Field;
