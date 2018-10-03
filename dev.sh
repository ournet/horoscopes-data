#!/bin/bash

yarn remove @ournet/domain
yarn remove @ournet/horoscopes-domain

yarn link @ournet/domain
yarn link @ournet/horoscopes-domain

yarn test
