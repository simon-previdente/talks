import React, { Component } from 'react';

import moment from 'moment';
import md5 from 'js-md5';

import {List, ListItem} from 'material-ui/List';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import {teal500, red400, amber500} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import Badge from 'material-ui/Badge';

class Talks extends Component {
  getFormat(format) {
    if (format === 'Pecha Kucha : 20 images x 20 secondes') {
      return <Avatar backgroundColor={teal500}>PK</Avatar>
    }
    if (format === 'Lightning Talk : 5 minutes') {
      return <Avatar backgroundColor={amber500}>LT</Avatar>
    }

    return null;
  }

  getTalk(talk, i) {
    return (
        <ListItem
            onTouchTap={() => this.props.selectTalk(talk)}
            key={i}
            primaryText={talk.titredetaprésentation}
            secondaryText={talk.prénometnom}
            leftAvatar={this.getFormat(talk.formats)}
          />
    )
  }

  render() {
    const {talks, count} = this.props;

    return (
      <div className="TalkList">
        <Tabs 
          onChange={value => this.props.setFilter(value)} 
          tabItemContainerStyle={{backgroundColor: red400}}
          inkBarStyle={{backgroundColor: 'white'}}>
          <Tab label={`All (${count.all})`} value={null} />
          <Tab label={`PK (${count.PK})`} value="PK" />
          <Tab label={`LT (${count.LT})`} value="LT" />
        </Tabs>
        <List>
          {talks.map((talk, i) => this.getTalk(talk, i))}
        </List>
      </div>
    );
  }
}

export default Talks;