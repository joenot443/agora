import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import superagent from 'superagent';
import { Button, Input, DatePicker, TimePicker } from 'antd';
import s from './NewLecture.css';
import combineDateTime from '../../util/combineDateTime';
import history from '../../history';

class NewLecture extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      titleInput: '',
      descriptionInput: '',
      startDateInput: null,
      startTimeInput: null,
      message: null,
    };
  }

  submitButtonPressed = async () => {
    const response = await superagent.post('/api/lectures/new').send({
      title: this.state.titleInput,
      description: this.state.descriptionInput,
      startTime: combineDateTime(
        this.state.startDateInput,
        this.state.startTimeInput,
      ),
    });

    if (response.body.success) {
      const id = response.body.id;
      history.push(`/host-lecture/${id}`);
    } else if (response.body.message) {
      this.setState({ message: response.body.message });
    } else {
      this.setState({ message: "Couldn't create Lecture." });
    }
  };

  formFilled = () =>
    this.state.titleInput &&
    this.state.descriptionInput &&
    this.state.startDateInput &&
    this.state.startTimeInput;

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Create a New Lecture</h1>
          <h4>Enter some details for your lecture. </h4>
          {this.state.message ? <h4>{this.state.message}</h4> : null}
          <div className={s.formContainer}>
            <div className={s.formBlock}>
              <h5 className={s.inputTitle}>Lecture Title</h5>
              <Input
                onChange={e => this.setState({ titleInput: e.target.value })}
                placeholder="Title for your Lecture"
              />
            </div>
            <div className={s.formBlock}>
              <h5 className={s.inputTitle}>Lecture Description</h5>
              <Input
                onChange={e =>
                  this.setState({ descriptionInput: e.target.value })
                }
                placeholder="What's your Lecture all about?"
              />
            </div>
            <div className={`${s.formBlock} ${s.formBlockHalf}`}>
              <h5 className={s.inputTitle}>Start Date</h5>
              <DatePicker
                onChange={v => this.setState({ startDateInput: v })}
              />
            </div>
            <div className={`${s.formBlock} ${s.formBlockHalf}`}>
              <h5 className={s.inputTitle}>Start Time</h5>
              <TimePicker
                onChange={v => this.setState({ startTimeInput: v })}
              />
            </div>
            <div className={s.submitButtonContainer}>
              <Button
                type="primary"
                onClick={this.submitButtonPressed}
                disabled={!this.formFilled()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(NewLecture);
