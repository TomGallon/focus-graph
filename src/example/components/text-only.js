import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';
import {connect as connectToDocumentation} from '../../behaviours/documentation';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

class UserTextOnly extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        load({id});
        loadMasterData();
    }
    render() {
        const {textFor} = this.props;
        return (
            <Panel title='Text only user page' {...this.props}>
                <div>{textFor('uuid', {editing: false})}</div>
                <div>{textFor('firstName')}</div>
                <div>{textFor('lastName')}</div>
            </Panel>
        );
    }
};

UserTextOnly.displayName = 'UserTextOnly';

const formConfig = {
    formKey: 'userDisplay',
    entityPathArray: ['user.information'],
    loadAction: loadUserAction,
};

export const tuto = `

`;
//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedDisplayUser = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers(),
    connectToDocumentation(tuto)
)(UserTextOnly);

export default ConnectedDisplayUser;
