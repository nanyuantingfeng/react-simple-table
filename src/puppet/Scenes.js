/**************************************************
 * Created by nanyuantingfeng on 12/09/2017 15:44.
 **************************************************/
import styles from '../../styles/Scenes.module.less';
import React, { PureComponent } from 'react';
import ICON from '../../styles/images/icon-setting.svg';

export default class Scenes extends PureComponent {

  static defaultProps = {
    label: ' 快速筛选 :',
    scenes: [],
  };

  state = {active: undefined};

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      this.setState({active: nextProps.active});
    }
  }

  handClick = (scene) => {
    const {onClick, bus} = this.props;
    const {active} = this.state;

    if (active === scene) { return; }
    // @scene: new, @active: old
    bus.emit('scene:changed', scene, active);
    this.setState({active: scene});
    onClick(scene);
  };

  handleEditScenes = () => {
    const {onEditScenes} = this.props;
    onEditScenes && onEditScenes();
  };

  renderScenes() {
    const {scenes, active} = this.props;

    if (!scenes || !scenes.length) { return null; }

    return scenes.map((line, index) => {
      const {text, sceneIndex} = line;
      let cssName = '';
      if (active === sceneIndex) { cssName = styles.active; }
      return (
        <a key={`${index}:${sceneIndex}`}
           className={cssName}
           onClick={() => this.handClick(sceneIndex)}
        >
          {text}
        </a>
      );
    });
  }

  render() {
    const {label, onEditScenes, noScene} = this.props;
    const editButton = (
      <a className={styles['edit-button']}
         onClick={this.handleEditScenes}>
        <img src={ICON}/>配置
      </a>
    );

    return (
      <div className={styles.scenesWrapper}>
        <label>{label}</label>
        <div className="scenes">
          {this.renderScenes()}
          {!noScene && onEditScenes && editButton}
        </div>
      </div>
    );
  }
}
