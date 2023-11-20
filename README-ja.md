# filmer 🎥

[![npm version](https://img.shields.io/badge/dynamic/json?color=blue&label=npm&prefix=v&query=version&suffix=%20&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcraf-te%2Ffilmer%2Fmain%2Fpackage.json)](https://www.npmjs.com/package/@craf-te/filmer)
[![size](https://img.shields.io/bundlephobia/minzip/%40craf-te%2Ffilmer?label=size)](https://bundlephobia.com/package/@craf-te/filmer)

[English](./README.md)

filmerはTypeScriptで書かれた軽量かつシンプルなrequest-animation-frameマネージャです。依存関係もありません 🚀

このツールは、クリエイターがスムーズにアニメーション実装を始められるようにサポートします 🔨

## インストール

パッケージマネージャを利用します。

```shell
npm i @craf-te/filmer
```

```JavaScript
import filmer from '@craf-te/filmer';
```

## 使い方

### 基本

```JavaScript
filmer
  .add('animation1',          // 一意なID,
    ({ time, deltaTime }) => {
      /* ここにアニメーションさせたい処理を記述します */
      console.log(time);      // 全体の経過時間
      console.log(deltaTime); // 前フレームからの経過時間
    }
  );

filmer.start();

// もしストップ、リセットしたい場合はこちらを実行します。
filmer.stop();
filmer.reset();
```

また、このように書くことも可能です。

```TypeScript
import filmer from '@craf-te/filmer';
import type { AnimationFunction } from '@craf-te/filmer';

const animate: AnimationFunction = ({ time, deltaTime }) => {
  console.log('something to animate',time, deltaTime);
}

filmer.add('animation1', animate);
filmer.start();
```

### アニメーションの削除

```JavaScript
const removeFunc = filmer.add('animation1', () => {});

// 削除は以下の2通りのやり方どちらでもOKです。
removeFunc();
filmer.remove('animation1');

// もしくはすべてのアニメーションを削除したい場合は以下を実行します。
filmer.removeAll();
```

### 実行順序 (optional)

第3引数に実行順を指定すると、昇順で実行されます。

```JavaScript
filmer.add('animation1', () => {}, 2);
filmer.add('animation2', () => {}, Infinity);
filmer.add('animation3', () => {}, 1);
filmer.start();

// これは以下の順番で実行されます
// 1, animation3
// 2, animation1
// 3, animation2
```

## 応用編

### fpsに影響を受けない係数

線形補間を使用するアニメーションのように係数を使用する実装では、fpsに影響されない係数を使用することができます。
これは例えば120fpsのモニターを使用していて、fpsが安定していない場合に便利です。

デフォルトのターゲットは60fpsです。変更するには引数に値を入力してください。

```JavaScript
filmer.add(
  'animation1',
  ({ time, deltaTime }) => {
    const coeff = 0.8;

    const adjustedCoeff = filmer.getLerpCoeff(coeff);

    // ターゲットを120fpsにしたい場合は引数に数値を入力します。
    const adjustedCoeff120 = filmer.getLerpCoeff(coeff, 120);
  }
)
```

### フレームワークでの利用

フロントエンドフレームワークの中で利用することもできます。
例えばReactの場合は以下のように書くことが可能です。

```TypeScript
// useRAF.ts

// カスタムフックを作成し、処理を再利用できるようにします。
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

### 実行順序の再整理

実行順序の引数には、整数以外の数値も指定できます。
数値を整理したい場合は、reorderを実行します。

```JavaScript
filmer.add('anim1', () => {}, 4.2);
filmer.add('anim2', () => {}, 2);
filmer.add('anim3', () => {}, -Infinity);
filmer.add('anim4', () => {}, 0.5);

filmer.reorder();
console.log(filmer.animationList)
```

```JavaScript
// 以下のようにorderの数値が自動で整理される。
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

## ライセンス

[The MIT License.](https://opensource.org/licenses/MIT)
