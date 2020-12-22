import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

export default function useXScroll(bounds, props) {
    const [{ x }, set] = useSpring(() => ({ x: 0, config: config.default }))
    const fn = useCallback(
      ({ xy: [, cy], movement: [mx, my],previous: [, py], memo = x.get() }) => {
        const newX = clamp(memo - mx, ...bounds)
        set({ x: newX })
        return newX
      },
      [bounds, x, set]
    )
    const bind = useGesture({ onDrag: fn }, props)
    useEffect(() => props && props.domTarget && bind(), [props, bind])
    return [x, bind]
  }
  