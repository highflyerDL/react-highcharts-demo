import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from "material-ui/MenuItem";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from "material-ui/List";
import { Link }from 'react-router';
import { browserHistory } from 'react-router'
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import {yellow500} from "material-ui/styles/colors";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {openDrawer: false, openPop: false};
        this.handleToggle = this.handleToggle.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.showPopover = this.showPopover.bind(this);
        this.handleClosePop = this.handleClosePop.bind(this);
    }

    handleToggle() {
        if(this.context.configs.isLoading){
            return;
        }
        this.setState({openDrawer: !this.state.openDrawer});
    }

    handleClose() {
        this.setState({openDrawer: false});
    }

    handleClosePop() {
        this.setState({openPop: false});
    }

    showDialog() {
        var dialog = {
            title: "Sign in",
            content: dialogContent,
        };
        this.props.showDialog(dialog);
    }

    showPopover(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openPop: true,
            anchorEl: event.currentTarget,
        });
    }

    render() {
        return (
            <div id="navbar">
                <AppBar
                    title="ZelsinkiLambda"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonTouchTap={this.handleToggle} onTitleTouchTap={this.handleToggle}>
                </AppBar>

                <Drawer open={this.state.openDrawer}
                        docked={false}
                        onRequestChange={(openDrawer) => this.setState({openDrawer})}>
                    <div className="upper-drawer" onTouchTap={this.handleToggle}>ZelsinkiLambda</div>
                    <Link to="/sensors/temperature"><MenuItem onTouchTap={this.handleToggle}>Temperature</MenuItem></Link>
                    <Link to="/sensors/light"><MenuItem onTouchTap={this.handleToggle}>Light</MenuItem></Link>
                    <Link to="/sensors/sound"><MenuItem onTouchTap={this.handleToggle}>Sound</MenuItem></Link>
                </Drawer>
            </div>
        )
    }
}
NavBar.contextTypes = {
  configs: React.PropTypes.object
};
export default NavBar;