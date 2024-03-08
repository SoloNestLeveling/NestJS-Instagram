import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FollowModel } from "./entity/follow.entity";
import { Repository } from "typeorm";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { UsersService } from "../users.service";
import { UsersModel } from "../entity/users.entity";
import { User } from "../entity/users.entity";





@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowModel)
        private readonly followRepository: Repository<FollowModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        private readonly usersService: UsersService

    ) { }


    // 팔로우시 현재 팔로우한 유저와 팔로우 당한 유저의 관계를 생성한다.

    async createFollow(userId: number, followingId: number) {

        const follow = this.followRepository.create({
            follower: {
                id: userId
            },
            following: {
                id: followingId
            }

        });


        const result = await this.followRepository.save(follow)

        return this.followRepository.find({
            where: {
                id: result.id
            },
            relations: ['following', 'follower']
        });



    }







    // 팔로우시 유저의 팔로워,팔로잉 리스트에 상태방을 추가하는 로직
    // userId = 현재 팔로워 하는 유저,  followingId = 현재 팔로워 당하는 유저


    async addFollowList(userId: number, followingId: number): Promise<boolean> {

        // 팔로워 유저와 팔로잉 유저를 가져온다.
        const followerUser = await this.usersService.getUserById(userId);
        const followingUser = await this.usersService.getUserById(followingId);


        // 현재 팔로워 하는 유저는 follower, 팔로워 당하는 유저는 following, 각각의 유저정보를 맵핑하여 가져온다.
        const follower = await this.getFollower(userId, followingId);

        const following = await this.getFollowing(userId, followingId);


        // follower가 존재하는지 체크!
        if (follower) {

            const followingUserFollowingList = followingUser.followingList;
            const followingUserFollowerList = followingUser.followerList;

            // 현재 팔로워 하는 유저의 정보를 팔로워 당한 유저의 리스트에 추가 할 거다.
            // 팔로워 당하는 입장에서 현재 자신을 팔로워 하는 유저의 정보는 팔로워 리스트에 저장.
            // 그리고 당연히 팔로워 당한 유저는 팔로워 하는 유저를 팔로잉하지 않고 있기 때문에 isFollow의 상태는 fasle 상태이다.
            // 팔로워 당하는 유저가 팔로워 하는 유저를 맞팔하면 isFollow는 true로 변경!


            // 팔로워 당한 유저를 나라고 가정하고 내가 과거에 지금 팔로워한 유저를 팔로워 했는지 팔로잉 리스트에서 찾는다!
            const prevFollowing = followingUserFollowingList.filter((a) => follower.map((b) => b.id).includes(a.id))



            // 만얃 이전에 지금 나를 팔로워한 유저를 팔로잉 한적이 없다면 당연히 맞팔 상태가 아님으로 isFollow는 false(디폴트)!
            if (prevFollowing.length === 0) {

                // 그냥 팔로워 리스트에 추가한다
                followingUserFollowerList.push(follower[0])



                //그런데 만약 내 팔로잉 리스트에 지금 나를 팔로워한 유저가 존재한다면 상대방과 나는 맞팔 상태가 됨으로 
                // 상대방이 나의 팔로워 리스트에 추가 될시 isFollow는 true로 변경된 상태로 저장되어야한다.   
            } else if (prevFollowing.length) {

                // 현재 나를 팔로우한 유저늬 isFollow 상태를 true 변경후 팔로워 리스트에 저장한다.
                follower.map((a) => a.isFollow = true)

                followingUserFollowerList.push(follower[0])



            } else {

                throw new InternalServerErrorException()
            }

            // 위에서 변경된 팔로잉 유저의 정보를 저장한다.
            await this.usersRepository.save(followingUser);


        }


        // 여기서는 설명을 쉽게 하기 위해서 팔로워 하는 사람을 나라고 가정 한다
        // 우선 팔로잉 존재 여부를 체크한다.
        if (following) {

            const followerUserFollowerList = followerUser.followerList;
            const followerUserFollowingList = followerUser.followingList;


            // 현재 팔로우 당한 상대방이 이전에 나를 팔로우 한적이 있는지 체크한다.
            // 이 전에 상대방이 나를 팔로우 한 적이 있다면 내 팔로워 리스트에 상대방 정보가 있을 거다.
            const prevFollower = followerUserFollowerList.filter((a) => following.map((b) => b.id).includes(a.id));


            // 만약 지금 내가 팔로우한 유저가 이전에 나를 팔로우 한적이 없다면!
            if (prevFollower.length === 0) {

                // 팔로우 당한 유저의 isFollow 상태를 true 변경후 내 팔로잉 리스트에 추가한다.
                following.map((a) => a.isFollow = true)
                followerUserFollowingList.push(following[0])


                // 그런데 지금 내가 팔로우한 유저가 이전에 나를 팔로우 한 적이 있다면 상대방과 나는 맞팔상태가 된다. 
                // 상대방은 내 팔로워 리스트에 isFollow가 fasle인 상태이다(당연히 맞팔한적이 없고 상대방만 나를 팔로우한 상태였음으로)   
            } else if (prevFollower.length) {


                following.map((a) => a.isFollow = true)
                followerUserFollowingList.push(following[0])

                // 상대방은 이전에 나를 팔로우한적이 있기때문에 isFollow가 false상태임으로 이제 맞팔상태가 되었기 때문에 true로 변경해준다.
                prevFollower.forEach((a) => a.isFollow = true)

            }

            await this.usersRepository.save(followerUser)
        }


        return true;
    };





    async followUser(userId: number, followingId: number) {

        const follow = await this.createFollow(userId, followingId);

        if (follow) {


            await this.addFollowList(userId, followingId)
            this.increseFollowerCount(followingId);
            this.increseFollowingCount(userId)

        };

        return 'follow';
    };




    // 언팔로우시 리스트 제거 

    async deleteFollowList(userId: number, unFollowingId: number): Promise<boolean> {
        // 팔로워 유저와 팔로잉 유저를 가져온다.
        const unFollowerUser = await this.usersService.getUserById(userId);
        const unFollowingUser = await this.usersService.getUserById(unFollowingId);


        // 현재 팔로워 하는 유저는 follower, 팔로워 당하는 유저는 following, 각각의 유저정보를 맵핑하여 가져온다.
        const unFollower = await this.getFollower(userId, unFollowingId);
        const unFollowing = await this.getFollowing(userId, unFollowingId);


        if (unFollower) {

            const userFollowerList = unFollowingUser.followerList;

            const prevFollower = userFollowerList.filter((a) => unFollower.map((b) => b.id).includes(a.id))

            if (prevFollower.length === 0) {

                throw new BadRequestException()

            } else if (prevFollower.length === 1) {

                const unFollowerId = unFollower.map((b) => b.id)

                const newList = userFollowerList.filter((a) => !unFollowerId.includes(a.id))

                userFollowerList.length = 0
                userFollowerList.push(...newList)


            };

            await this.usersRepository.save(unFollowingUser);


        }



        if (unFollowing) {

            const userFollowingList = unFollowerUser.followingList;

            const prevFollowing = userFollowingList.filter((a) => unFollowing.map((b) => b.id).includes(a.id));
            const prevFollower = userFollowingList.filter((a) => unFollowing.map((b) => b.id).includes(a.id))

            if (prevFollowing.length === 1 && prevFollower.length === 1) {

                const unFollowingId = unFollowing.map((b) => b.id)

                const newList = (userFollowingList as User[]).filter((a) => !unFollowingId.includes(a.id)) //제거
                userFollowingList.length = 0
                userFollowingList.push(...newList)

                prevFollower.map((a) => a.isFollow = false) // 팔로워 리스트에서 언팔로우한 유저 isFollow 상태 false로 변경



            } else if (prevFollowing.length === 1 && prevFollower.length === 0) {

                const unFollowingId = unFollowing.map((b) => b.id)

                const newList = userFollowingList.filter((a) => !unFollowingId.includes(a.id));

                userFollowingList.length = 0;
                userFollowingList.push(...newList)


            } else {

                throw new BadRequestException()
            }

            await this.usersRepository.save(unFollowerUser);


        }
        return true;


    };



    async unFollowUser(userId: number, unfollowingId: number) {

        await this.deleteFollowList(userId, unfollowingId);

        await this.decreseFollowerCount(unfollowingId);
        await this.decreseFollowingCount(userId)


        return 'unfollow'
    }









    // 팔로워 아이디를 통해서 지금 팔로잉한 유저를 findOne이 아닌 find로 찾은 후 팔로잉 유저의 정보를 map으로 맵핑한다.
    async getFollowing(userId: number, followingId: number): Promise<User[]> {
        const following = await this.followRepository.find({
            where: {
                follower: {
                    id: userId
                },
                following: {
                    id: followingId
                }
            },
            relations: ['following', 'following.profile', 'following.profile.image']
        });

        return following.map((a) => ({
            id: a.following.id,
            name: a.following.nickname,
            isFollow: a.isFollow,
            profileImg: a.following.profile.image
        }));



    };





    // 현재 팔로우하는 유저의 정보를 맵핑한다.
    async getFollower(userId: number, followingId: number): Promise<User[]> {
        const follower = await this.followRepository.find({
            where: {
                follower: {
                    id: userId
                },
                following: {
                    id: followingId
                }
            },
            relations: ['follower', 'follower.profile', 'follower.profile.image']
        });

        return follower.map((a) => ({
            id: a.follower.id,
            name: a.follower.nickname,
            isFollow: a.isFollow,
            profileImg: a.follower.profile.image
        }));



    };


    async testGetProfile(userId: number, followingId: number) {
        const profile = await this.getFollowing(userId, followingId)
        console.log(...profile)
        return profile;

    }





    increseFollowingCount(userId: number) {

        return this.usersRepository.increment({
            id: userId
        }, 'followingCount', 1)
    }

    increseFollowerCount(userId: number) {

        return this.usersRepository.increment({
            id: userId
        }, 'followerCount', 1)
    }


    async decreseFollowingCount(userId: number) {

        const user = await this.usersService.getUserById(userId)

        this.usersRepository.decrement({
            id: userId
        }, 'followingCount', 1)

        if (user.followingCount < 0) {

            user.followingCount = 0;
            await this.usersRepository.save(user);
        };

        return true;
    }

    async decreseFollowerCount(userId: number) {

        const user = await this.usersService.getUserById(userId)

        this.usersRepository.decrement({
            id: userId
        }, 'followerCount', 1)

        if (user.followerCount < 0) {

            user.followerCount = 0;
            await this.usersRepository.save(user);
        };

        return true;

    }





}




