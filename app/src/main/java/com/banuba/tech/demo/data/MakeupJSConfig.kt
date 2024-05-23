package com.banuba.tech.demo.data

enum class MakeupJSConfig(val js: String) {
    EYES_SHADOW_COSNOVA("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

    setState(
      {
        "eyeshadow": {
          "color": "0.97 0.87 0.89",
          "finish": "glitter_metallic",
          "coverage": "hi"
        }
      }
    )
    """),
    EYES_SHADOW_GUCCI("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

     setState(
       {
         "eyeshadow": {
           "color": "0.917 0.698 0.619",
           "finish": "matte",
           "coverage": "hi"
         }
       }
     )
    """),
    LIPSTICK_APRICOT("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

     setState(
       {
         "lipstick": {
           "color": "0.835 0.36 0.486",
           "finish": "balm",
           "coverage": "hi"
         }
       }
     )
    """),
    LIPSTICK_PLUM("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

     setState(
       {
         "lipstick": {
           "color": "0.388 0.090 0.075",
           "finish": "satin",
           "coverage": "hi"
         }
       }
     )
    """),
    FOUNDATION_GUCCI("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

     setState(
       {
         "foundation": {
           "color": "0.796 0.608 0.463",
           "finish": "radiance",
           "coverage": "mid"
         }
       }
     )
    """),
    FOUNDATION_LOREAL("""
    Object.assign(globalThis, { setState, setMode })

    setState({})
    setMode("speed")

     setState(
       {
         "foundation": {
           "color": "0.714 0.537 0.380",
           "finish": "matte",
           "coverage": "mid"
         }
       }
     )
    """),
    LOOK_GUCCI("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

     setState(
       {
           "foundation": {
           "color": "0.894 0.682 0.505",
           "finish": "natural",
           "coverage": "lo"
         },
          "eyeliner": {
           "color": "0.635 0.776 0.898",
           "finish": "cream",
           "coverage": "hi"
         },
           "eyebrows": {
           "color": "0.396 0.384 0.388",
           "finish": "matte",
           "coverage": "mid"
         },
           "eyeshadow": {
           "color": "0.643 0.525 0.494",
           "finish": "shimmer",
           "coverage": "hi"
         },
           "lipstick": {
           "color": "1.0 0.439 0.486",
           "finish": "balm",
           "coverage": "hi"
         }
       }
     )
    """),
    LOOK_REVLON("""
    Object.assign(globalThis, { setState, setMode })
    setState({})
    setMode("speed")

     setState(
       {
         "lipstick": {
           "color": "0.68, 0.07, 0.19",
           "finish": "matte_liquid",
           "coverage": "hi"
         },
           "eyebrows": {
           "color": "0.14, 0.11, 0.10",
           "finish": "matte",
           "coverage": "mid"
         },
           "eyeliner": {
           "color": "0.10, 0.06, 0.04",
           "finish": "matte_cream",
           "coverage": "hi"
         },
           "foundation": {
           "color": "0.87, 0.65, 0.48",
           "finish": "natural",
           "coverage": "mid"
         },
           "eyelashes": {
           "color": "0.0, 0.0, 0.00",
           "finish": "lengthening",
           "coverage": "hi"
         },
           "eyeshadow": {
           "color": "0.38, 0.30, 0.28",
           "finish": "glitter_sheer",
           "coverage": "hi"
         },
           "blush": {
           "color": "0.85, 0.53, 0.51",
           "finish": "shimmer",
           "coverage": "mid"
         }
       }
     )
    """)
}