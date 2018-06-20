/**
 * Created by LinK on 2017/12/4.
 */
import styles from '../../styles/SelectAllBtn.module.less'

export default function SelectAllBtn(props) {
  const { total, data={}, onClick } = props
  if (total === 0) return null
  let text = `选择全部${total}项`

  return (
    <span
      onClick={() => onClick()}
      style={data}
      className={styles.selectAllBtn}>
      {text}
    </span>
  )
}