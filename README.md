# filmer

[日本語](./README-ja.md)

JavaScript/TypeScript request-animation-frame manager.

⚠️ : Currently in alpha. There may be breaking changes.

## install

using a package manager:

```shell
npm i @craf-te/filmer
```

```JavaScript
import filmer from '@craf-te/filmer';
```

## how to use

### basic usage

```JavaScript

filmer
  .add('animation1',          // unique id,
    ({ time, deltaTime }) => {
      /* do something */
      console.log(time);      // elapsed time
      console.log(deltaTime); // time difference from the previous frame
    }
  );

filmer.start();

// if you need to stop/reset,
filmer.stop();
// or
filmer.reset();
```

and also, it can be written this way.

```TypeScript
import filmer from '@craf-te/filmer';
import type { AnimationFunction } from '@craf-te/filmer';

const animate: AnimationFunction = ({ time, deltaTime }) => {
  console.log('something to animate',time, deltaTime);
}

filmer.add('animation1', animate);
filmer.start();
```

### remove animation

```JavaScript
const removeFunc = filmer.add('animation1', () => {});

removeFunc();
// or
filmer.remove('animation1');
// or if you want to remove all,
filmer.removeAll();
```

### order of execution (optional)

If the third argument specifies the order of execution, it will be executed in ascending order.

```JavaScript
filmer.add('animation1', () => {}, 2);
filmer.add('animation2', () => {}, Infinity);
filmer.add('animation3', () => {}, 1);
filmer.start();

// executed in the following order
// 1, animation3
// 2, animation1
// 3, animation2
```

## advanced

### coefficient not affected by fps

For implementations that use coefficients, such as animations using linear interpolation, coefficients that are not affected by fps can be used.
This is useful, for example, when using a 120 fps monitor and the fps is not stable.

The default target is 60fps. To change it, enter a value in the argument.

```JavaScript
filmer.add(
  'animation1',
  ({ time, deltaTime }) => {
    const coeff = 0.8;

    const adjustedCoeff = filmer.getLerpCoeff(coeff);

    // if you want to set target to 120fps,
    const adjustedCoeff120 = filmer.getLerpCoeff(coeff, 120);
  }
)
```

### using with framework

It can also be used in a front-end framework.
For example, if you use React, you can write the following.

```TypeScript
// useRAF.ts

// reusing Logic with Custom Hooks
import { useEffect, useId } from "react";

import filmer from "@craf-te/filmer";
import type { AnimationFunction } from "@craf-te/filmer";

export const useRAF = (callback: AnimationFunction, order?: number) => {
  const id = useId();
  useEffect(()=> {
    const remove = filmer.add(id, callback, order);
    if(!filmer.isAnimating) filmer.start();
    return () => remove();
  }, [callback, id, order]);
}
```

```tsx
// component.tsx

import type { AnimationFunction } from '@craf-te/filmer';
import { useCallback } from 'react';

import { useRAF } from '<useRAF-file-path>';

export default function Component() {
  const animation: AnimationFunction = useCallback(({ time, deltaTime }) => {
    console.log(time, deltaTime);
  }, []);

  useRAF(animation);

  return <div>{/* something */}</div>;
}
```

### re-arrangement of execution order

The execution order argument accepts numbers other than integers. If you want to rearrange the numbers again, execute reorder.

```JavaScript
filmer.add('anim1', () => {}, 4.2);
filmer.add('anim2', () => {}, 2);
filmer.add('anim3', () => {}, -Infinity);
filmer.add('anim4', () => {}, 0.5);

filmer.reorder();
console.log(filmer.animationList)
```

```JavaScript
// result log
[
  {
    id: 'anim3',
    order: -Infinity
    update: () => {}
  },{
    id: 'anim4',
    order: 0
    update: () = {}
  },{
    id: 'anim2',
    order: 1
    update: () => {}
  },{
    id: 'anim1',
    order: 2
    update: () => {}
  }
]
```
