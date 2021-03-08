#!/usr/bin/env bash

version=`cat version.txt`
package=./cmd/gotailwindcss/main.go
# if [[ -z "$package" ]]; then
#   echo "usage: $0 <package-name>"
#   exit 1
# fi
package_split=(${package//\// })
package_name=gotailwindcss

platforms=("windows/amd64" "darwin/amd64" "linux/amd64")

for platform in "${platforms[@]}" ; do
    platform_split=(${platform//\// })
    GOOS=${platform_split[0]}
    GOARCH=${platform_split[1]}
    output_name=$package_name'-v'$version'-'$GOOS'-'$GOARCH
    file_name=$package_name
    if [ $GOOS = "windows" ]; then
        file_name+='.exe'
    fi

    echo "building ${output_name}"
    env GOOS=$GOOS GOARCH=$GOARCH go build -o ./scripts/builds/$file_name $package
    if [ $? -ne 0 ]; then
        echo 'An error has occurred! Aborting the script execution...'
        exit 1
    fi
    cd ./scripts/builds/
    tar -czf $output_name.tgz $file_name
    rm $file_name
    cd ../../
done