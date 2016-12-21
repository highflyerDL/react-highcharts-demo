import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import NavBar from "./Navbar";
import FlatButton from "material-ui/FlatButton";

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialog: {
                title: "",
                open: false,
                actions: [],
                content: null
            }
        };
        this.configs = {
            isLoading : false
        };
        this.onShowDialog = this.onShowDialog.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);

        this.defaultActions = [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.handleDialogClose}/>
        ];
    }

    handleDialogClose() {
        this.state.dialog.open = false;
        this.setState(this.state);
    }

    getChildContext() {
        return {configs: this.configs};
    }

    onShowDialog(dialog, isClose) {
        if (isClose) {
            dialog.open = false;
            this.setState({dialog: dialog});
            return;
        }
        dialog.open = true;
        if (dialog.actions) {
            dialog.actions.push(this.defaultActions);
        } else {
            dialog.actions = this.defaultActions;
        }
        this.setState({dialog: dialog});
    }


    render() {
        return (
            <div>
                <NavBar showDialog={this.onShowDialog}/>
                {this.props.children && React.cloneElement(this.props.children, {
                    showDialog: this.onShowDialog
                })}
                <Dialog title={this.state.dialog.title}
                        actions={this.state.dialog.actions}
                        modal={false}
                        open={this.state.dialog.open}
                        onRequestClose={this.handleDialogClose}>
                    {this.state.dialog.content}
                </Dialog>
            </div>
        )
    }
}

Main.childContextTypes = {
  configs: React.PropTypes.object
};