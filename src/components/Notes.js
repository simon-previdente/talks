import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { getMyData, getAverage } from '../selectors/Notes';
import { vote } from '../actions/Notes';


class NotesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteOpen: false,
      myNote: props.myNote
    };
  }


  handleNestedListToggle = () => {
    this.setState({
      voteOpen: !this.state.voteOpen,
    });
  };

  handleNoteChange = (event, index, value) => {
    this.setState({
      myNote: value
    });
    this.props.vote(this.props.myName, value);
  }

  getMyNote() {
    const { myName, myProfileName } = this.props;
    if (myName === null) {
      return (
        <TableRow>
          <TableRowColumn>Ton nom ({myProfileName}) n'est pas dans la liste des votants.</TableRowColumn>
          <TableRowColumn></TableRowColumn>
        </TableRow>
      )
    }

    return (
      <TableRow>
        <TableRowColumn>{`Ma note (${myName})`}</TableRowColumn>
        <TableRowColumn>
          <SelectField
              value={this.state.myNote}
              onChange={this.handleNoteChange}
            >
              <MenuItem value={-2} primaryText="Exclusion (-2)" />
              <MenuItem value={-1} primaryText="Désaprobation (-1)" />
              <MenuItem value={0} primaryText="Neutre (0)" />
              <MenuItem value={1} primaryText="Approbation (1)" />
              <MenuItem value={2} primaryText="Sélection (2)" />
            </SelectField>
        </TableRowColumn>
      </TableRow>
    )
  }

  getDetailsNote() {
    if (!this.state.voteOpen) {
      return null;
    }

    const { othersNote } = this.props;

    let othersNoteRow = Object.keys(othersNote).map((member, i) => {
      if (othersNote[member] !== undefined) {
        return (
          <TableRow key={i}>
            <TableRowColumn>{member}</TableRowColumn>
            <TableRowColumn>{Math.round(othersNote[member])}</TableRowColumn>
          </TableRow>
        );
      }
      return null;
    });

    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Prénom</TableHeaderColumn>
            <TableHeaderColumn>Note</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.getMyNote()}
          {othersNoteRow}
        </TableBody>
      </Table>
    )
    
  }

  render() {
    const average = this.props.average === undefined ? '-' : this.props.average;
    const iconStyle = {transform: this.state.voteOpen ? 'rotate(180deg)' : 'none'};
    
    return (
      <div>
        <div style={{margin: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span><strong>Note moyenne :&nbsp;</strong>{average}</span>
          <IconButton
            style={iconStyle}
            onClick={() => this.handleNestedListToggle()}
            touch={true}
            tooltipPosition="top-right"
            >
            <KeyboardArrowDown />
          </IconButton>
        </div>
        {this.getDetailsNote()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const notes = state.notes[state.selectedTalk];
  const myData = getMyData(notes, state.profile.name);
  const myNote = myData.note !== undefined ? Math.round(myData.note) : 0;
  let othersNote = {...notes};
  delete othersNote[myData.name];

  return {
    myNote: myNote,
    myName: myData.name,
    myProfileName: state.profile.name,
    othersNote: othersNote,
    average: getAverage(notes)
  };
}

const mapDispatchToProps = dispatch => {
  return {
    vote: (name, note) => dispatch(vote(name, note))
  };
}

const Notes = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesView)

export default Notes;