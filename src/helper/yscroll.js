import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'


 export default function useYScroll(bounds, props) {
    const [{ y }, set] = useSpring(() => ({ y: 10, config: {tension:200,friction:100}}))
    const fn = useCallback(
      ({ xy: [, cy], movement: [mx, my],previous: [, py], memo = y.get() }) => {
        const newY = clamp(memo + my, ...bounds)
        set({ y: newY })
        return newY
      },
      [bounds, y, set]
    )
    const bind = useGesture({ onWheel: fn, onDrag: fn }, props)
    useEffect(() => props && props.domTarget && bind(), [props, bind])
    return [y, bind]
  }

